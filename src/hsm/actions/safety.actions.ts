import { Vec3 } from 'vec3'
import { assign } from 'xstate'

import type { MachineContext } from '@/hsm/context'
import type { MachineEvent } from '@/hsm/types'

import {
	blockApproach,
	recordApproach,
	resumeApproach
} from '@/utils/combat/approachPolicy'

export const safetyActions = {
	blockCombatApproach: assign<
		MachineContext,
		MachineEvent,
		undefined,
		MachineEvent,
		never
	>(({ context }) => ({
		approachAttempts: blockApproach(context),
		rangedUnavailable: true
	})),
	resumeCombatApproach: assign<
		MachineContext,
		MachineEvent,
		undefined,
		MachineEvent,
		never
	>(({ context }) => ({ approachAttempts: resumeApproach(context) })),
	recordCombatApproach: assign<
		MachineContext,
		MachineEvent,
		undefined,
		MachineEvent,
		never
	>(({ context }) => ({ approachAttempts: recordApproach(context, false) })),
	recordApproachRouteFailure: assign<
		MachineContext,
		MachineEvent,
		undefined,
		MachineEvent,
		never
	>(({ context }) => ({ approachAttempts: recordApproach(context, true) })),
	observeRecoveryFood: assign<
		MachineContext,
		MachineEvent,
		undefined,
		MachineEvent,
		never
	>(({ event }) =>
		event.type === 'RECOVERY_FOOD_AVAILABILITY'
			? { recoveryNoFoodNotified: !event.available }
			: {}
	),
	storeRecoveryRelocation: assign<
		MachineContext,
		MachineEvent,
		undefined,
		MachineEvent,
		never
	>(({ event }) =>
		event.type === 'RECOVERY_RELOCATION'
			? { recoveryRelocation: event.relocation }
			: {}
	),
	observeDamage: assign<
		MachineContext,
		MachineEvent,
		undefined,
		MachineEvent,
		never
	>(({ context, event }) => {
		if (event.type !== 'DAMAGE_OBSERVED') return {}
		let recoveryRelocation = context.recoveryRelocation
		const bot = context.bot
		if (bot?.autoEat?.isEating && bot.entity?.position) {
			const position = bot.entity.position
			const source = event.sourcePosition ?? context.nearestThreat?.position
			const yaw = source
				? Math.atan2(source.x - position.x, source.z - position.z)
				: bot.entity.yaw
			const distance = context.preferences.fleeTargetDistance
			recoveryRelocation = {
				from: new Vec3(position.x, position.y, position.z),
				goal: position.offset(
					-Math.sin(yaw) * distance,
					0,
					-Math.cos(yaw) * distance
				)
			}
		}
		return {
			recoveryRelocation,
			lastDamage: {
				sequence: context.lastDamage.sequence + 1,
				observedAt: Date.now(),
				sourceId: event.sourceId,
				sourcePosition: event.sourcePosition
			}
		}
	}),
	cancelDamagedEating: ({ context }: { context: MachineContext }) => {
		if (context.recoveryRelocation) context.bot?.utils.stopEating()
	},
	observePassability: assign<
		MachineContext,
		MachineEvent,
		undefined,
		MachineEvent,
		never
	>(({ context, event }) =>
		event.type === 'PASSABILITY_CHANGED'
			? {
					approachAttempts: Object.fromEntries(
						Object.entries(context.approachAttempts).map(([id, attempt]) => [
							id,
							attempt.blocked &&
							context.bot &&
							context.bot.entity.position.distanceTo(event.position) <=
								context.preferences.fleeTargetDistance * 2
								? { ...attempt, worldChanged: true }
								: attempt
						])
					)
				}
			: {}
	)
}
