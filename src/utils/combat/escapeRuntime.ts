import { Movements } from 'mineflayer-pathfinder'
import type { PartiallyComputedPath } from 'mineflayer-pathfinder'
import { Vec3 } from 'vec3'

import type { Bot } from '@/types'

import type { MachineContext, ThreatObservation } from '@/hsm/context'

import { GoalXZ } from '@/modules/plugins/goals'

import { hasMovementController } from './movementController'
import { MovementProgress } from './movementProgress'
import {
	clearMicroMovement,
	enableMicroMovement,
	stopPathfinderMovement
} from './runtimeControl'

type EscapeMode = 'NONE' | 'MOVEMENT' | 'PATHFINDER'
// Upstream incorrectly narrows generator results to ComputedPath (omits partial).
type RouteSearch = IterableIterator<{ result: PartiallyComputedPath }>

/** One invoked behavior owns this runtime; it owns no independent loop or subscriptions. */
export class EscapeRuntime {
	private mode: EscapeMode = 'NONE'
	private readonly movements: Movements
	private readonly progress: MovementProgress
	private goal: Vec3 | null = null
	private search: RouteSearch | null = null
	private candidates: Vec3[] = []
	private blockedAt: Vec3 | null = null
	private blockedThreat: Vec3 | null = null
	private microFailed = false
	private steeringThreat: Vec3 | null = null
	private plannedThreat: { id: number; position: Vec3 } | null = null

	constructor(
		private readonly bot: Bot,
		private readonly preferences: MachineContext['preferences']
	) {
		this.movements = new Movements(bot)
		this.movements.canDig = false
		this.movements.allow1by1towers = false
		this.movements.scafoldingBlocks = []
		this.movements.allowSprinting = true
		this.progress = new MovementProgress(
			preferences.escapeNoProgressMs,
			preferences.movementProgressDistance
		)
	}

	stop() {
		clearMicroMovement(this.bot)
		if (this.mode !== 'NONE' || this.goal) stopPathfinderMovement(this.bot)
		this.mode = 'NONE'
		this.goal = null
		this.search = null
		this.candidates = []
		this.steeringThreat = null
		this.plannedThreat = null
		this.progress.reset()
	}

	worldChanged(position?: Vec3) {
		if (
			position &&
			this.bot.entity.position.distanceTo(position) >
				this.preferences.fleeTargetDistance * 2
		)
			return
		this.blockedAt = null
		this.blockedThreat = null
		this.microFailed = false
	}

	routeFailed() {
		if (!this.goal || this.search) return
		stopPathfinderMovement(this.bot)
		this.goal = null
		this.progress.reset()
	}

	async physicsTick() {
		if (this.mode !== 'MOVEMENT' || !this.steeringThreat) return
		const position: Vec3 = this.bot.entity.position
		let yaw = Math.atan2(
			this.steeringThreat.x - position.x,
			this.steeringThreat.z - position.z
		)
		enableMicroMovement(this.bot)
		if (hasMovementController(this.bot)) {
			this.bot.movement.setGoal(this.bot.movement.goals.Default)
			this.bot.movement.heuristic
				.get('proximity')
				.target(this.steeringThreat)
				.avoid(true)
			yaw = this.bot.movement.getYaw(360, 36, 1)
			if (!Number.isFinite(yaw)) throw new Error('Invalid escape steering')
			await this.bot.movement.steer(yaw, true)
		}
	}

	move(
		threat: ThreatObservation | null,
		threats: ThreatObservation[],
		relocation: Vec3 | null
	): EscapeMode {
		const position: Vec3 = this.bot.entity.position
		if (
			this.goal &&
			threat &&
			(!this.plannedThreat ||
				threat.entityId !== this.plannedThreat.id ||
				threat.position.distanceTo(this.plannedThreat.position) >=
					this.preferences.escapeThreatChangeDistance) &&
			(this.goal.x - position.x) * (threat.position.x - position.x) +
				(this.goal.z - position.z) * (threat.position.z - position.z) >
				0
		) {
			this.stop()
			this.microFailed = false
		}
		if (this.blockedAt) {
			const displaced =
				Math.hypot(
					position.x - this.blockedAt.x,
					position.z - this.blockedAt.z
				) >= this.preferences.movementProgressDistance
			const threatChanged =
				threat &&
				this.blockedThreat &&
				threat.position.distanceTo(this.blockedThreat) >=
					this.preferences.escapeThreatChangeDistance
			if (!displaced && !threatChanged) return 'NONE'
			this.blockedAt = null
		}
		if (
			!relocation &&
			threat &&
			threat.distance < 15 &&
			!this.microFailed &&
			this.mode !== 'PATHFINDER' &&
			hasMovementController(this.bot)
		) {
			if (this.mode !== 'MOVEMENT') {
				stopPathfinderMovement(this.bot)
				this.progress.reset()
			}
			this.mode = 'MOVEMENT'
			this.steeringThreat = threat.position
			if (this.progress.observe(position, -threat.distance, Date.now())) {
				// Apply controls immediately; rotation is updated by the next physics tick.
				enableMicroMovement(this.bot)
				return this.mode
			}
			this.microFailed = true
			this.stop()
		}
		if (this.goal && !this.search) {
			const remaining = Math.hypot(
				position.x - this.goal.x,
				position.z - this.goal.z
			)
			if (remaining < 1.5) {
				this.stop()
				this.microFailed = false
			} else if (this.progress.observe(position, remaining, Date.now()))
				return 'PATHFINDER'
			else this.routeFailed()
		}
		if (this.mode !== 'PATHFINDER') {
			clearMicroMovement(this.bot)
			this.bot.pathfinder.setMovements(this.movements)
			this.mode = 'PATHFINDER'
			this.plannedThreat = threat
				? { id: threat.entityId, position: threat.position.clone() }
				: null
			const away = threat
				? Math.atan2(
						position.z - threat.position.z,
						position.x - threat.position.x
					)
				: 0
			this.candidates = Array.from(
				{ length: this.preferences.escapeRouteAttempts },
				(_, index) => {
					const angle =
						away + (index * Math.PI * 2) / this.preferences.escapeRouteAttempts
					return position.offset(
						Math.cos(angle) * this.preferences.fleeTargetDistance,
						0,
						Math.sin(angle) * this.preferences.fleeTargetDistance
					)
				}
			).sort((a, b) => this.clearance(b, threats) - this.clearance(a, threats))
			if (relocation) this.candidates.unshift(relocation)
		}
		if (!this.search) {
			this.goal = this.candidates.shift() ?? null
			if (!this.goal) {
				this.stop()
				this.blockedAt = position.clone()
				this.blockedThreat = threat?.position.clone() ?? null
				this.bot.chat(
					'Застрял: проходимый выход не найден. Продолжаю следить за возможностью отхода.'
				)
				return 'NONE'
			}
			this.search = this.bot.pathfinder.getPathFromTo(
				this.movements,
				position,
				new GoalXZ(Math.floor(this.goal.x), Math.floor(this.goal.z)),
				{
					timeout: this.preferences.escapeRouteTimeoutMs,
					tickTimeout: this.preferences.escapeSearchSliceMs,
					searchRadius: this.preferences.fleeTargetDistance * 2
				}
			)
		}
		const next = this.search.next()
		if (next.done || next.value.result.status !== 'partial') {
			this.search = null
			if (
				!next.done &&
				next.value.result.status === 'success' &&
				next.value.result.path.length &&
				this.goal
			) {
				this.bot.pathfinder.setGoal(
					new GoalXZ(Math.floor(this.goal.x), Math.floor(this.goal.z))
				)
				this.progress.reset()
			} else this.goal = null
		}
		return this.mode
	}

	private clearance(position: Vec3, threats: ThreatObservation[]) {
		return threats.length
			? Math.min(...threats.map(threat => position.distanceTo(threat.position)))
			: 0
	}
}
