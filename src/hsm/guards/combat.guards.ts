import type { MachineGuardParams } from '@/hsm/types'

import { canSeeEnemy } from '@/utils/combat/enemyVisibility'

const canUseRanged = ({ context }: MachineGuardParams): boolean => {
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

export default {
	canSkirmishRanged,
	isEnemyInMeleeRange
}
