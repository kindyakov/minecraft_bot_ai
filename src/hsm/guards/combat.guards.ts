import type { MachineContext } from '@/hsm/context'
import type { MachineEvent } from '@/hsm/types'
import type { MachineGuardParams } from '@/hsm/types'

import {
	approachIsBlocked,
	canResumeApproach
} from '@/utils/combat/approachPolicy'
import { canSeeEnemy } from '@/utils/combat/enemyVisibility'
import {
	forbidsMelee,
	isDefensiveCandidate,
	requiresAvoidance
} from '@/utils/combat/selfDefense'

const canUseRanged = ({ context }: MachineGuardParams): boolean => {
	if (
		requiresAvoidance(context) ||
		(forbidsMelee(context) &&
			context.combatTarget.distance <=
				context.preferences.creeperDangerDistance)
	)
		return false
	if (context.rangedUnavailable) return false
	const weapon = context.bot?.utils.getRangeWeapon()
	const arrows = context.bot?.utils.getArrow()
	const hasWeaponAndArrows = !!weapon && !!arrows

	if (!hasWeaponAndArrows) return false

	// Проверка видимости врага (raycast)
	if (!context.bot || !context.combatTarget?.entity) return false

	return canSeeEnemy(context.bot, context.combatTarget.entity)
}

const isEnemyInMeleeRange = ({ context }: MachineGuardParams): boolean => {
	return (
		context.combatTarget.entity !== null &&
		context.combatTarget.distance <= context.preferences.enemyMeleeRange
	)
}

const canSkirmishRanged = ({ context, event }: MachineGuardParams): boolean => {
	return (
		context.combatTarget.entity !== null &&
		context.combatTarget.distance > context.preferences.enemyMeleeRange &&
		canUseRanged({ context, event })
	)
}

export const isCombatTargetUpdateEvent = (
	event: MachineEvent
): event is Extract<MachineEvent, { type: 'UPDATE_COMBAT_TARGET' }> =>
	event.type === 'UPDATE_COMBAT_TARGET'

const meleeExitRangeBuffer = 1.5

const getMeleeExitRange = (context: Pick<MachineContext, 'preferences'>) =>
	context.preferences.enemyMeleeRange + meleeExitRangeBuffer

export const eventCanAutoEnterCombat = ({
	context,
	event
}: {
	context: MachineContext
	event: MachineEvent
}) =>
	isCombatTargetUpdateEvent(event) &&
	context.preferences.autoDefend &&
	!context.combatStopRequested &&
	isDefensiveCandidate(context, event.combatTarget.entity)

export const eventEnemyInMeleeRange = ({
	event,
	context
}: {
	context: MachineContext
	event: MachineEvent
}) =>
	isCombatTargetUpdateEvent(event) &&
	Boolean(event.combatTarget.entity) &&
	event.combatTarget.distance <= context.preferences.enemyMeleeRange

export const eventCanSkirmishRanged = ({
	context,
	event
}: MachineGuardParams) =>
	isCombatTargetUpdateEvent(event) &&
	canSkirmishRanged({
		event,
		context: { ...context, combatTarget: event.combatTarget }
	})

export const eventCanSkirmishRangedFromMelee = ({
	event,
	context
}: {
	context: MachineContext
	event: MachineEvent
}) => {
	if (
		!isCombatTargetUpdateEvent(event) ||
		!event.combatTarget.entity ||
		event.combatTarget.distance <= getMeleeExitRange(context)
	) {
		return false
	}

	return eventCanSkirmishRanged({ event, context })
}

export default {
	mustRetreat: ({ context, event }: MachineGuardParams) =>
		(!context.bot?.utils.getMeleeWeapon() || forbidsMelee(context)) &&
		!canSkirmishRanged({ context, event }),
	approachIsBlocked: ({ context }: MachineGuardParams) =>
		approachIsBlocked(context),
	canResumeApproach: ({ context }: MachineGuardParams) =>
		canResumeApproach(context) &&
		!requiresAvoidance(context) &&
		!forbidsMelee(context) &&
		Boolean(context.bot?.utils.getMeleeWeapon()),
	canSkirmishRanged,
	isEnemyInMeleeRange
}
