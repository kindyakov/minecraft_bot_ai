import { assign } from "xstate"
import { findNearbyEnemies } from "../../utils/findNearbyEnemies.js"

const setTargetOnEnemy = assign(({ context }) => {
  const nearestEnemy = findNearbyEnemies(context)
  const entity = nearestEnemy || null
  const distance = nearestEnemy?.position.distanceTo(context.position) || Infinity

  return {
    nearestEnemy: {
      entity,
      distance,
    },
  }
})

export default {
  setTargetOnEnemy
}