import { assign } from 'xstate';

const updateHealth = assign({
  health: (context, event) => event.health
})

const updateFood = assign({
  food: (context, event) => event.food
})

export default {
  updateHealth,
  updateFood,
}
