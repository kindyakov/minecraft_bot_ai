import { assign } from 'xstate';

const setBot = assign({
  bot: ({ context, event }) => event.bot
});

const updatePosition = assign({
  position: ({ context, event }) => event.position
})

const updateFoodSaturation = assign({
  foodSaturation: ({ context, event }) => event.foodSaturation
})

export default {
  setBot,
  updatePosition,
  updateFoodSaturation,
}
