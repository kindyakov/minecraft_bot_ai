import type { Entity } from '@/types'

import Logger from '@/config/logger'

import {
	type BaseServiceState,
	createStatefulService
} from '@/hsm/helpers/createStatefulService.js'

import { GoalNear, GoalXZ } from '@/modules/plugins/goals.js'

import { hasMovementController } from '@/utils/combat/movementController'
import {
	clearMicroMovement,
	enableMicroMovement,
	stopMeleeAttack,
	stopPathfinderMovement,
	stopRangedAttack
} from '@/utils/combat/runtimeControl'
import {
	SURVIVAL_MOVEMENT_DISTANCE,
	type SurvivalMode,
	canFleeToPlayer
} from '@/utils/combat/survival'

interface EmergencyRecoveryState extends BaseServiceState {
	mode: SurvivalMode
	lastPathGoalKey: string | null
	lastPathGoalIssuedAt: number
}

const pathGoalReissueMs = 750

const logSurvivalRuntime = (
	event: string,
	payload: Record<string, unknown>
) => {
	Logger.debug(`[SURVIVAL] ${event}`, payload)
}

const setMode = (
	state: EmergencyRecoveryState,
	setState: (updates: Partial<EmergencyRecoveryState>) => void,
	sendBack: (event: any) => void,
	mode: SurvivalMode
) => {
	if (state.mode === mode) {
		return
	}

	setState({ mode })
	sendBack({ type: 'SURVIVAL_MODE_CHANGED', mode })
}

const stopCombatControllers = (bot: any) => {
	stopMeleeAttack(bot, 'urgent_survival')
	stopRangedAttack(bot, 'urgent_survival')
}

const resetMovementForEating = (
	bot: any,
	state: EmergencyRecoveryState,
	setState: (updates: Partial<EmergencyRecoveryState>) => void
) => {
	clearMicroMovement(bot)
	stopPathfinderMovement(bot)
	setState({
		lastPathGoalKey: null,
		lastPathGoalIssuedAt: 0
	})
}

const ensurePathfinderMode = (bot: any) => {
	clearMicroMovement(bot)

	if (bot.movements) {
		bot.movements.allowSprinting = true
		if (typeof bot.pathfinder?.setMovements === 'function') {
			bot.pathfinder.setMovements(bot.movements)
		}
	}
}

const getFleeYaw = (position: any, threatPosition: any): number | null => {
	if (!position || !threatPosition) {
		return null
	}

	// Mineflayer forward is (-sin(yaw), -cos(yaw)), not the positive axes.
	return Math.atan2(
		threatPosition.x - position.x,
		threatPosition.z - position.z
	)
}

const applyMovementFleeSteering = (bot: any, context: any) => {
	const position = context.position ?? bot.entity?.position ?? null
	const threatPosition = context.nearestThreat?.position
	let yaw = getFleeYaw(position, threatPosition)

	if (yaw === null) {
		return false
	}

	enableMicroMovement(bot)

	if (hasMovementController(bot)) {
		bot.movement.setGoal(bot.movement.goals.Default)
		bot.movement.heuristic.get('proximity').target(threatPosition).avoid(true)
		yaw = bot.movement.getYaw(360, 36, 1)
	}
	if (!Number.isFinite(yaw))
		throw new Error('Flee steering returned an invalid yaw')
	if (hasMovementController(bot)) return bot.movement.steer(yaw, true)
	if (typeof bot.look === 'function') {
		return bot.look(yaw, bot.entity?.pitch ?? 0, true)
	}

	return true
}

const activateMovementFlee = ({
	bot,
	context,
	state,
	setState,
	sendBack
}: {
	bot: any
	context: any
	state: EmergencyRecoveryState
	setState: (updates: Partial<EmergencyRecoveryState>) => void
	sendBack: (event: any) => void
}) => {
	const threatPosition = context.nearestThreat?.position

	if (!threatPosition) {
		return false
	}

	if (state.mode !== 'MOVEMENT') stopPathfinderMovement(bot)
	const steering = applyMovementFleeSteering(bot, context)
	if (steering === false) return false

	setMode(state, setState, sendBack, 'MOVEMENT')
	setState({
		lastPathGoalKey: null,
		lastPathGoalIssuedAt: 0
	})
	if (state.mode !== 'MOVEMENT')
		logSurvivalRuntime('movement_flee', {
			distance: Number((context.nearestThreat?.distance ?? Infinity).toFixed(2))
		})
	return steering
}

const issuePathfinderGoal = ({
	bot,
	state,
	setState,
	key,
	goal
}: {
	bot: any
	state: EmergencyRecoveryState
	setState: (updates: Partial<EmergencyRecoveryState>) => void
	key: string
	goal: unknown
}) => {
	const now = Date.now()
	if (
		state.lastPathGoalKey === key &&
		now - state.lastPathGoalIssuedAt < pathGoalReissueMs
	) {
		return
	}

	bot.pathfinder.setGoal(goal)
	setState({
		lastPathGoalKey: key,
		lastPathGoalIssuedAt: now
	})
}

const activatePlayerEscape = ({
	bot,
	context,
	state,
	setState,
	sendBack,
	player
}: {
	bot: any
	context: any
	state: EmergencyRecoveryState
	setState: (updates: Partial<EmergencyRecoveryState>) => void
	sendBack: (event: any) => void
	player: Entity
}) => {
	ensurePathfinderMode(bot)
	setMode(state, setState, sendBack, 'PATHFINDER')

	issuePathfinderGoal({
		bot,
		state,
		setState,
		key: `player:${player.id}`,
		goal: new GoalNear(
			player.position.x,
			player.position.y,
			player.position.z,
			3
		)
	})

	logSurvivalRuntime('flee_to_player', {
		playerId: player.id,
		playerName: player.username ?? player.name ?? 'unknown'
	})
}

const activatePathfinderFlee = ({
	bot,
	context,
	state,
	setState,
	sendBack
}: {
	bot: any
	context: any
	state: EmergencyRecoveryState
	setState: (updates: Partial<EmergencyRecoveryState>) => void
	sendBack: (event: any) => void
}) => {
	const threat = context.nearestThreat
	const position = context.position ?? bot.entity?.position ?? null

	if (!threat || !position) {
		return
	}

	const threatPosition = context.nearestThreat?.position ?? threat.position
	const deltaX = position.x - threatPosition.x
	const deltaZ = position.z - threatPosition.z
	const planarDistance = Math.hypot(deltaX, deltaZ)
	const directionX = planarDistance > 0.001 ? deltaX / planarDistance : 1
	const directionZ = planarDistance > 0.001 ? deltaZ / planarDistance : 0
	const fleeTargetX =
		position.x + directionX * context.preferences.fleeTargetDistance
	const fleeTargetZ =
		position.z + directionZ * context.preferences.fleeTargetDistance
	const goalX = Math.floor(fleeTargetX)
	const goalZ = Math.floor(fleeTargetZ)

	ensurePathfinderMode(bot)
	setMode(state, setState, sendBack, 'PATHFINDER')
	issuePathfinderGoal({
		bot,
		state,
		setState,
		key: `flee:${threat.entityId}:${goalX}:${goalZ}`,
		goal: new GoalXZ(goalX, goalZ)
	})

	logSurvivalRuntime('pathfinder_flee', {
		enemyId: threat.entityId,
		distance: Number(threat.distance.toFixed(2)),
		to: {
			x: goalX,
			z: goalZ
		}
	})
}

const activateEatingRecovery = ({
	bot,
	state,
	setState,
	sendBack
}: {
	bot: any
	state: EmergencyRecoveryState
	setState: (updates: Partial<EmergencyRecoveryState>) => void
	sendBack: (event: any) => void
}) => {
	resetMovementForEating(bot, state, setState)
	setMode(state, setState, sendBack, 'EATING')
}

const createEmergencyRecoveryService = (kind: 'health' | 'food') =>
	createStatefulService<EmergencyRecoveryState>({
		name: kind === 'health' ? 'EmergencyHealing' : 'EmergencyEating',
		timeoutMs: 60_000,
		tickInterval: 100,
		asyncTickInterval: 100,
		initialState: {
			mode: 'IDLE',
			lastPathGoalKey: null,
			lastPathGoalIssuedAt: 0
		},

		onStart: ({ bot, state, setState, sendBack }) => {
			stopCombatControllers(bot)
			bot.utils.stopEating?.()

			if (bot.movements) {
				bot.movements.allowSprinting = true
			}

			setMode(state, setState, sendBack, 'IDLE')
		},

		onTick: ({ bot, context, state, setState, sendBack }) => {
			const restored =
				kind === 'health'
					? context.health >= context.preferences.healthFullyRestored
					: context.food >= context.preferences.foodRestored

			if (restored) {
				resetMovementForEating(bot, state, setState)
				bot.utils.stopEating?.()
				setMode(state, setState, sendBack, 'IDLE')
				sendBack({
					type: kind === 'health' ? 'HEALTH_RESTORED' : 'FOOD_RESTORED'
				})
				return
			}

			const threat = context.nearestThreat
			const position = context.position ?? bot.entity?.position ?? null
			const player = bot.utils.searchPlayer?.() ?? null

			if (
				threat &&
				canFleeToPlayer(context, position, player) &&
				threat.distance < context.preferences.safeEatDistance
			) {
				bot.utils.stopEating?.()
				activatePlayerEscape({
					bot,
					context,
					state,
					setState,
					sendBack,
					player
				})
				return
			}

			if (threat && threat.distance < SURVIVAL_MOVEMENT_DISTANCE) {
				bot.utils.stopEating?.()
				const moved = activateMovementFlee({
					bot,
					context,
					state,
					setState,
					sendBack
				})

				if (moved === false) {
					activatePathfinderFlee({
						bot,
						context,
						state,
						setState,
						sendBack
					})
				}
				return moved
			}

			if (threat && threat.distance < context.preferences.safeEatDistance) {
				bot.utils.stopEating?.()
				activatePathfinderFlee({
					bot,
					context,
					state,
					setState,
					sendBack
				})
				return
			}

			if (
				context.food <
					(kind === 'health' ? 18 : context.preferences.foodRestored) &&
				bot.utils.getAllFood().length === 0
			) {
				sendBack({
					type: 'RECOVERY_FAILED',
					reason: 'No food available for recovery',
					cause: 'no_food'
				})
				return
			}
			return activateEatingRecovery({
				bot,
				state,
				setState,
				sendBack
			})
		},

		onAsyncTick: async api => {
			if (api.state.mode !== 'EATING') return
			try {
				await api.bot.utils.eating()
			} catch (error) {
				// Canceling food to flee is expected, not a failed recovery.
				if (api.state.mode === 'EATING') throw error
			}
		},

		onCleanup: ({ bot, state, setState }) => {
			try {
				resetMovementForEating(bot, state, setState)
			} finally {
				bot.utils.stopEating?.()
			}
		},

		onEvents: () => ({
			physicsTick: (api: {
				bot: any
				state: EmergencyRecoveryState
				getContext: () => any
			}) => {
				if (api.state.mode !== 'MOVEMENT') {
					return
				}

				return applyMovementFleeSteering(api.bot, api.getContext())
			}
		})
	})

const serviceEmergencyHealing = createEmergencyRecoveryService('health')
const serviceEmergencyEating = createEmergencyRecoveryService('food')

export default {
	serviceEmergencyHealing,
	serviceEmergencyEating
}
