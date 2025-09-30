import { and, not, stateIn } from "xstate"

const canUseRanged = ({ context }) => {
  const weapon = context.bot.utils.getRangeWeapon()
  const arrows = context.bot.utils.getArrow()
  return weapon && arrows
}

const canUseWeapon = () => !!bot.utils.getMeleeWeapon()

const canUseRangedAndEnemyFar = ({ context }) => {
  return canUseRanged({ context }) && context.nearestEnemy?.distance > context.preferences.enemyRangedRange
}

const isLowHealth = ({ context, event }) => context.health <= context.preferences.healthCritical

const isSurrounded = and([
  ({ context, event }) => false
])

export default {
  canUseRanged,
  canUseWeapon,
  canUseRangedAndEnemyFar,
  isLowHealth,
  isSurrounded,
}