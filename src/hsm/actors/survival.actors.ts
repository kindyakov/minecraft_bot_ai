import { Vec3 } from 'vec3'

import type { Block } from '@/types'

import {
	hasFreshThreatObservation,
	isRecoveryDistanceSafe
} from '@/hsm/guards/survival.guards'
import {
	type BaseServiceState,
	createStatefulService
} from '@/hsm/helpers/createStatefulService'

import { EscapeRuntime } from '@/utils/combat/escapeRuntime'
import { hasPassabilityChanged } from '@/utils/combat/passability'
import {
	stopMeleeAttack,
	stopRangedAttack
} from '@/utils/combat/runtimeControl'
import type { SurvivalMode } from '@/utils/combat/survival'

interface SafetyState extends BaseServiceState {
	escape: EscapeRuntime | null
	mode: SurvivalMode
}

/** Safety is continuous; eating and route attempts can fail without releasing the obligation. */
const createSafetyService = (kind: 'health' | 'food' | 'retreat') =>
	createStatefulService<SafetyState>({
		name:
			kind === 'retreat'
				? 'TacticalRetreat'
				: kind === 'health'
					? 'EmergencyHealing'
					: 'EmergencyEating',
		tickInterval: 100,
		asyncTickInterval: 100,
		initialState: { escape: null, mode: 'IDLE' },
		onStart: ({ bot, context, setState }) => {
			stopMeleeAttack(bot, 'safety')
			stopRangedAttack(bot, 'safety')
			bot.utils.stopEating()
			setState({
				escape: new EscapeRuntime(bot, context.preferences)
			})
		},
		onTick: api => {
			const { bot, context, state, setState, sendBack } = api
			const escape = state.escape
			if (!escape || context.health <= 0) return
			const setMode = (mode: SurvivalMode) => {
				if (api.state.mode === mode) return
				setState({ mode })
				sendBack({ type: 'SURVIVAL_MODE_CHANGED', mode })
			}
			const foodAvailable = bot.utils.getAllFood().length > 0
			if (
				kind === 'health' &&
				context.recoveryNoFoodNotified === foodAvailable
			) {
				if (!foodAvailable)
					bot.chat(
						'Критическая ситуация: здоровье низкое, еды нет. Остаюсь в режиме выживания.'
					)
				sendBack({
					type: 'RECOVERY_FOOD_AVAILABILITY',
					available: foodAvailable
				})
			}
			const position: Vec3 = bot.entity.position
			let relocation = context.recoveryRelocation
			if (
				relocation &&
				Math.hypot(
					position.x - relocation.from.x,
					position.z - relocation.from.z
				) >=
					context.preferences.fleeTargetDistance - 1
			) {
				relocation = null
				sendBack({ type: 'RECOVERY_RELOCATION', relocation: null })
			}
			const threat = context.nearestThreat
			const safe = isRecoveryDistanceSafe(context)
			const relocating = relocation !== null
			const restored =
				kind === 'retreat' ||
				(kind === 'health'
					? context.health >= context.preferences.healthFullyRestored
					: context.food >= context.preferences.foodRestored)
			if (!threat && !hasFreshThreatObservation(context)) {
				escape.stop()
				bot.utils.stopEating()
				setMode('IDLE')
				return
			}
			if (restored && safe && !relocating) {
				escape.stop()
				bot.utils.stopEating()
				setMode('IDLE')
				sendBack({
					type:
						kind === 'retreat'
							? 'RETREAT_SAFE'
							: kind === 'health'
								? 'HEALTH_RESTORED'
								: 'FOOD_RESTORED'
				})
				return
			}
			const mustFlee =
				relocating ||
				(threat &&
					(!hasFreshThreatObservation(context) ||
						(api.state.mode === 'EATING'
							? threat.distance <= context.preferences.interruptEatDistance
							: !safe)))
			if (mustFlee) {
				bot.utils.stopEating()
				const exploding =
					kind === 'retreat'
						? context.threats.find(
								candidate =>
									candidate.creeper &&
									(candidate.creeper.swelling !== false ||
										candidate.creeper.ignited !== false) &&
									candidate.distance <=
										context.preferences.creeperDangerDistance
							)
						: null
				const owner = escape.move(
					exploding ?? threat,
					context.threats,
					safe ? (relocation?.goal ?? null) : null
				)
				setMode(owner === 'NONE' ? 'IDLE' : owner)
				return
			}
			escape.stop()
			if (context.food >= context.preferences.foodRestored) {
				setMode('IDLE')
				return
			}
			if (!foodAvailable) {
				bot.utils.stopEating()
				setMode('IDLE')
				if (kind !== 'health')
					sendBack({
						type: 'RECOVERY_FAILED',
						cause: 'no_food',
						reason: 'Еды нет; безопасный отход завершён.'
					})
				return
			}
			setMode('EATING')
		},
		onAsyncTick: async api => {
			if (api.state.mode !== 'EATING') return
			try {
				await api.bot.utils.eating()
			} catch (error) {
				if (
					!api.abortSignal.aborted &&
					api.state.mode === 'EATING' &&
					!api.context.recoveryRelocation
				)
					throw error
			}
		},
		onCleanup: ({ bot, state }) => {
			try {
				state.escape?.stop()
			} finally {
				bot.utils.stopEating()
			}
		},
		onEvents: () => ({
			physicsTick: api => api.state.escape?.physicsTick(),
			path_update: (api, result: { status?: string }) => {
				if (result.status === 'noPath' || result.status === 'timeout')
					api.state.escape?.routeFailed()
			},
			blockUpdate: (api, before: Block | null, after: Block | null) => {
				if (after && hasPassabilityChanged(before, after))
					api.state.escape?.worldChanged(after.position)
			}
		})
	})

export default {
	serviceEmergencyHealing: createSafetyService('health'),
	serviceEmergencyEating: createSafetyService('food'),
	serviceTacticalRetreat: createSafetyService('retreat')
}
