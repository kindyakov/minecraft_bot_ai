import { assign } from 'xstate';

const updateHealth = assign({
  health: (context, event) => event.health
})

const updateFood = assign({
  food: (context, event) => event.food
})

const updateEntities = assign({
  entities: (context, event) => event.entities
})

const updatePosition = assign({
  position: (context, event) => event.position
})

export default {
  updateHealth,
  updateFood,
  updateEntities,
  updatePosition,
}
