import { assign } from 'xstate';
import { isEntityOfType } from "../../utils/isEnemyEntity.js"

const updateHealth = assign({
  health: ({ context, event }) => event.health
})

const updateFood = assign({
  food: ({ context, event }) => event.food
})

const addEntities = assign(({ context, event: { entity } }) => {
  const key = isEntityOfType(entity) ? 'enemies' : 'entities'

  const mobs = [...context[key]]
  if (!mobs.some(mob => mob.id === entity.id)) {
    mobs.push(entity)
  }

  return { [key]: mobs }
})

const updateEntities = assign(({ context, event: { entity } }) => {
  const key = isEntityOfType(entity) ? 'enemies' : 'entities'
  const mobs = context[key].map(mob => (mob.id === entity.id ? entity : mob));

  return { [key]: mobs }
})

const removeEntity = assign(({ context, event: { entity } }) => {
  const key = isEntityOfType(entity) ? 'enemies' : 'entities'

  return {
    [key]: () => context[key].filter(mob => mob.id !== entity.id)
  }
})

export default {
  updateHealth,
  updateFood,
  addEntities,
  updateEntities,
  removeEntity,
}