import { and, not, stateIn, or } from "xstate"

const canUseRanged = ({ context }) => {
  const weapon = context.bot.utils.getRangeWeapon()
  const arrows = context.bot.utils.getArrow()
  return weapon && arrows
}

const canUseWeapon = ({ context }) => !!context.bot.utils.getMeleeWeapon()

const canUseRangedAndEnemyFar = ({ context }) => {
  return canUseRanged({ context }) && context.nearestEnemy?.distance > context.preferences.enemyRangedRange
}

const isLowHealth = ({ context, event }) => context.health <= context.preferences.healthCritical

const isEnemyMelee = ({ context, event }) => event.distance <= context.preferences.enemyMeleeRange

const isEnemyFar = ({ context, event }) => event.distance > context.preferences.enemyRangedRange

const isSurrounded = and([
  ({ context, event }) => false
])

const canExitCombat = or([
  // Можно выйти если НЕ в FLEEING
  not(stateIn({ MAIN_ACTIVITY: { COMBAT: 'FLEEING' } })),
  // ИЛИ если в FLEEING но здоровье восстановилось
  ({ context }) => context.health > context.preferences.healthRestored
])

export default {
  canUseRanged,
  canUseWeapon,
  canUseRangedAndEnemyFar,
  isLowHealth,
  isEnemyMelee,
  isEnemyFar,
  isSurrounded,
  canExitCombat
}