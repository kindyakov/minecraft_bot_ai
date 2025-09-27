import { assign } from 'xstate';

const setBot = assign({
  bot: ({ context, event }) => event.bot
});

const updatePosition = assign({
  position: ({ context, event }) => event.position
})

export default {
  setBot,
  updatePosition,
}
