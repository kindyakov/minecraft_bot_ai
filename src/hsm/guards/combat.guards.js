const noEnemiesNearby = ({ context }) => !context.enemies
  .some(enemy => enemy.position.distanceTo(context.position) <= context.preferences.maxDistToEnemy)

const isLowLealth = ({ context, event }) => context.health <= 8

const isDeciding = ({ context, event }) => context.combatContextChanged === true

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
  isLowLealth,
  isDeciding,
  isSurrounded,
  isEnemyFar,
  isEnemyClose,
}