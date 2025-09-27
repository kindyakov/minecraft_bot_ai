const noEnemiesNearby = ({ context }) => !context.enemies
  .some(enemy => enemy.position.distanceTo(context.position) <= context.preferences.maxDistToEnemy)

const isFleeing = ({ context, event }) => context.health <= 8

const hasContextCombatChanged = ({ context, event }) => context.combatContextChanged

const isLowLealth = ({ context, event }) => context.health <= 8

const isSurrounded = ({ context, event }) => false

const isEnemyFar = ({ context, event }) => {
  const enemy = context.nearestEnemy
  return enemy && enemy.distance >= 4
}

const isEnemyClose = ({ context, event }) => {
  const enemy = context.nearestEnemy
  return enemy && enemy.distance <= 4
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