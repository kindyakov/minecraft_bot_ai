import { assign } from "xstate"
import { findNearbyEnemies } from "../../utils/findNearbyEnemies.js"

const setTargetOnEnemy = assign(({ context }) => {
  const nearestEnemy = findNearbyEnemies(context)
  return {
    nearestEnemy: nearestEnemy ? {
      entity: nearestEnemy,
      distance: nearestEnemy.position.distanceTo(context.position)
    } : null,
  }
})

export default {
  setTargetOnEnemy
}