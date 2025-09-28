import { assign } from 'xstate';
import { isEntityOfType } from "../../utils/isEnemyEntity.js"

const updateHealth = assign({
  health: ({ context, event }) => event.health
})

const updateFood = assign({
  food: ({ context, event }) => event.food
})

const updateEntities = assign(({ context, event: { entity } }) => {
  if (!context.position || entity.position.distanceTo(context.position) > 50) {
    return {}
  }

  const key = isEntityOfType(entity) ? 'enemies' : 'entities'
  const mobs = [...context[key]]

  const existingIndex = mobs.findIndex(mob => mob.id === entity.id)

  if (existingIndex >= 0) {
    mobs[existingIndex] = entity
  } else {
    mobs.push(entity)
  }

  return { [key]: mobs }
})

const removeEntity = assign(({ context, event: { entity } }) => {
  const key = isEntityOfType(entity) ? 'enemies' : 'entities'

  return {
    [key]: context[key].filter(mob => mob.id !== entity.id)
  }
})

export default {
  updateHealth,
  updateFood,
  updateEntities,
  removeEntity,
}