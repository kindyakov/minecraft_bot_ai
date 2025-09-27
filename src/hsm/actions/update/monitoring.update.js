import { assign } from 'xstate';

const updateHealth = assign({
  health: ({ context, event }) => event.health
})

const updateFood = assign({
  food: ({ context, event }) => event.food
})

const updateEntities = assign({
  entities: ({ context, event }) => {
    const enemies = [...context.enemies]

    if (!enemies.some(e => e.uuid === event.entity.uuid)) {
      enemies.push(event.entity)
    }

    return enemies
  }
})

export default {
  updateHealth,
  updateFood,
  updateEntities,
}