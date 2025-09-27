import { assign } from 'xstate';
import { isEntityOfType } from "../../utils/isEnemyEntity.js"

const updateHealth = assign({
  health: ({ context, event }) => event.health
})

const updateFood = assign({
  food: ({ context, event }) => event.food
})

const updateEntities = assign(({ context, event: { entity } }) => {
  const key = isEntityOfType(entity) ? 'enemies' : 'entities'

  let mobs = [...context[key]]

  if (mobs.some(mob => mob.id === entity.id)) {
    mobs = mobs.map(mob => (mob.id === entity.id ? entity : mob));
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
  addEntities,
  updateEntities,
  removeEntity,
}