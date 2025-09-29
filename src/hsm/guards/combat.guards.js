import { and, not, stateIn } from "xstate"

const canUseRanged = ({ context }) => {
  const weapon = context.bot.utils.getRangeWeapon()
  const arrows = context.bot.utils.getArrow()
  return weapon && arrows
}

const canUseRangedAndEnemyFar = ({ context }) => {
  return canUseRanged({ context }) && context.nearestEnemy?.distance > 8
}

const isLowHealth = ({ context, event }) => context.health <= 8

const isSurrounded = and([
  ({ context, event }) => false
])

export default {
  canUseRanged,
  canUseRangedAndEnemyFar,
  isLowHealth,
  isSurrounded,
}