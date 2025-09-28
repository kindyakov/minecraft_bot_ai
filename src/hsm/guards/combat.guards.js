const noEnemiesNearby = ({ context }) => {
  if (!context.position || !context.enemies.length) return true

  return !context.enemies.some(enemy =>
    enemy.position &&
    enemy.position.distanceTo(context.position) <= context.preferences.maxDistToEnemy
  )
}

const isFleeing = ({ context, event }) => context.health <= 8

const hasContextCombatChanged = ({ context, event }) => context.combatContextChanged

const isLowLealth = ({ context, event }) => context.health <= 8

const isSurrounded = ({ context, event }) => false

const isEnemyFar = ({ context: { nearestEnemy }, event }) => {
  return nearestEnemy && nearestEnemy.distance > 4
}

const isEnemyClose = ({ context: { nearestEnemy }, event }) => {
  return nearestEnemy && nearestEnemy.distance <= 4
}

export default {
  noEnemiesNearby,
  isFleeing,
  isLowLealth,
  hasContextCombatChanged,
  isSurrounded,
  isEnemyFar,
  isEnemyClose,
}