import { assign } from "xstate"

const updateCombatContext = assign(({ context }) => {
  // Фильтруем врагов в радиусе
  const nearbyEnemies = context.enemies.filter(enemy =>
    enemy.position.distanceTo(context.position) <= context.preferences.maxDistToEnemy
  )

  // Находим ближайшего
  const newNearestEnemy = nearbyEnemies.reduce((closest, enemy) => {
    if (!closest) return enemy

    const currentDistance = enemy.position.distanceTo(context.position)
    const closestDistance = closest.position.distanceTo(context.position)

    return currentDistance < closestDistance ? enemy : closest
  }, null)

  const oldNearestId = context.nearestEnemy?.entity?.id

  return {
    nearestEnemy: newNearestEnemy ? {
      entity: newNearestEnemy,
      distance: newNearestEnemy.position.distanceTo(context.position)
    } : null,
    combatContextChanged: newNearestEnemy?.id !== oldNearestId
  }
})

export default {
  updateCombatContext,
}