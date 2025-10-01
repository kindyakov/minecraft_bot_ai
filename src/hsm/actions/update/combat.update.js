import { assign } from "xstate"

const clearCombatContext = assign({
  nearestEnemy: {
    entity: null,
    distance: Infinity,
  },
  prevCombatState: {
    enemyId: null,
    distance: Infinity,
    health: 20
  }
})

export default {
  clearCombatContext,
}