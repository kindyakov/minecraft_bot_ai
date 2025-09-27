import { assign } from "xstate"

const updateCombatContext = assign({
  nearestEnemy: ({ context }) => {
    const enemy = context.bot.utils.findNearestEnemy(context.preferences.maxDistToEnemy)
    return enemy ? {
      entity: enemy,
      distance: enemy.position.distanceTo(context.position)
    } : null
  },
  combatContextChanged: ({ context }, event) => {
    const newEnemy = context.bot.utils.findNearestEnemy(context.preferences.maxDistToEnemy)
    const oldEnemy = context.nearestEnemy?.entity

    // Изменился ли ближайший враг?
    return newEnemy?.id !== oldEnemy?.id
  }
})

export default {
  updateCombatContext,
}