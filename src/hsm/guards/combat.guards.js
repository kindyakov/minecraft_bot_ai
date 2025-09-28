import { and, not, stateIn } from "xstate"

const noEnemiesNearby = ({ context }) => {
  if (!context.position || !context.enemies.length) return true

  return !context.enemies.some(enemy =>
    enemy.position &&
    enemy.position.distanceTo(context.position) <= context.preferences.maxDistToEnemy
  )
}

const hasContextCombatChanged = ({ context, event }) => context.combatContextChanged && context.health > 8

const isLowLealth = and([
  not(stateIn({ MAIN_ACTIVITY: { COMBAT: 'FLEEING' } })),
  ({ context, event }) => context.health <= 8
])

const isSurrounded = ({ context, event }) => false

const isEnemyFar = and([
  ({ context }) => {
    const rangedWeapon = context.bot.utils.getRangeWeapon() // поиск оружия лук/арбалет
    const arrows = context.bot.utils.getArrow()
    return rangedWeapon && arrows
  },
  ({ context: { nearestEnemy }, event }) => {
    return nearestEnemy && nearestEnemy.distance > 5
  }
])

const isEnemyClose = ({ context: { nearestEnemy }, event }) => {
  return nearestEnemy && nearestEnemy.distance <= 5
}

export default {
  noEnemiesNearby,
  isLowLealth,
  hasContextCombatChanged,
  isSurrounded,
  isEnemyFar,
  isEnemyClose,
}