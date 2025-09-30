import { assign } from "xstate"

const clearCombatContext = assign({
  prevCombatState: {
    enemyId: null,
    distance: 0,
    health: 20
  }
})

export default {
  clearCombatContext,
}