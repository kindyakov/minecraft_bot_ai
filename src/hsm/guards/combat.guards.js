import { and, not, stateIn } from "xstate"

const noEnemiesNearby = ({ context }) => {
  if (!context.enemies.length) return true

  return !context.enemies?.some(enemy =>
    enemy.position &&
    enemy.position.distanceTo(context.position) <= context.preferences.maxDistToEnemy
  )
}

const isLowLealth = and([
  not(stateIn({ MAIN_ACTIVITY: { COMBAT: 'FLEEING' } })),
  ({ context, event }) => context.health <= 8
])

const isSurrounded = and([
  not(stateIn({ MAIN_ACTIVITY: { COMBAT: 'DEFENDING' } })),
  ({ context, event }) => context.health > 8,
  ({ context, event }) => false
])

const isEnemyFar = and([
  not(stateIn({ MAIN_ACTIVITY: { COMBAT: 'RANGED_ATTACKING' } })),
  ({ context, event }) => context.health > 8,
  ({ context }) => {
    const rangedWeapon = context.bot.utils.getRangeWeapon() // поиск оружия лук/арбалет
    const arrows = context.bot.utils.getArrow()
    return rangedWeapon && arrows
  },
  ({ context: { nearestEnemy }, event }) => {
    return nearestEnemy && nearestEnemy.distance > 7
  }
])

const isEnemyClose = and([
  not(stateIn({ MAIN_ACTIVITY: { COMBAT: 'MELEE_ATTACKING' } })),
  ({ context, event }) => context.health > 8,
  ({ context: { nearestEnemy }, event }) => {
    return nearestEnemy && nearestEnemy.distance <= 7
  }])

export default {
  noEnemiesNearby,
  isLowLealth,
  isSurrounded,
  isEnemyFar,
  isEnemyClose,
}