import { assign } from "xstate"

const clearCombatContext = assign({
  nearestEnemy: null,
  combatContextChanged: false
})

export default {
  clearCombatContext
}