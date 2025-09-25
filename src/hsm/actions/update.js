import { assign } from 'xstate';

const setBot = assign({
  bot: ({ context, event }) => event.bot
});

const updateHealth = assign({
  health: ({ context, event }) => event.health
})

const updateFood = assign({
  food: ({ context, event }) => event.food
})

const updateEntities = assign({
  entities: ({ context, event }) => event.entities
})

const updatePosition = assign({
  position: ({ context, event }) => event.position
})

export default {
  setBot,
  updateHealth,
  updateFood,
  updateEntities,
  updatePosition,
}
