import { assign } from 'xstate';

const setBot = assign({
  bot: ({ context, event }) => event.bot
});

const updatePosition = assign({
  position: ({ context, event }) => event.position
})

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
  setBot,
  updateHealth,
  updateFood,
  updateEntities,
  updatePosition,
}
