import { and, not, stateIn, or } from "xstate"

const canUseRanged = ({ context }) => {
  const weapon = context.bot.utils.getRangeWeapon()
  const arrows = context.bot.utils.getArrow()
  return weapon && arrows
}

const canUseRangedAndEnemyFar = ({ context }) => {
  return canUseRanged({ context }) && context.nearestEnemy?.distance > context.preferences.enemyRangedRange
}

const isSurrounded = ({ context, event }) => false

export default {
  canUseRanged,
  canUseRangedAndEnemyFar,
  isSurrounded,
}