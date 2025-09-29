import { assign } from "xstate"

const clearCombatContext = assign({
  previousCombatState: {
    enemyId: null,
    distance: null,
    health: 20
  }
})

export default {
  clearCombatContext,
}