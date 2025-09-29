import { assign } from "xstate"
import { findNearbyEnemies } from "../../utils/findNearbyEnemies.js"

const updateCombatContext = assign(({ context }) => {
  // Находим ближайшего
  const newNearestEnemy = findNearbyEnemies(context)
  const oldNearestId = context.nearestEnemy?.entity?.id

  return {
    nearestEnemy: newNearestEnemy ? {
      entity: newNearestEnemy,
      distance: newNearestEnemy.position.distanceTo(context.position)
    } : null,
    combatContextChanged: oldNearestId && newNearestEnemy?.id !== oldNearestId
  }
})

const clearCombatContext = assign({
  nearestEnemy: null,
  combatContextChanged: false
})

export default {
  updateCombatContext,
  clearCombatContext,
}