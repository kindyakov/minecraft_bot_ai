import { and, not, stateIn } from 'xstate';

const isFoodRestored = and([
  not(stateIn({ MAIN_ACTIVITY: { URGENT_NEEDS: 'EMERGENCY_EATING' } })),
  ({ context, event }) => context.food === 20
])

const isHealthRestored = and([
  not(stateIn({ MAIN_ACTIVITY: { URGENT_NEEDS: 'EMERGENCY_HEALING' } })),
  ({ context, event }) => {
    console.log(`Я наелся здоровье: ${context.bot.health}`)
    return context.health === 20
  }
])

export default {
  isFoodRestored,
  isHealthRestored,
}