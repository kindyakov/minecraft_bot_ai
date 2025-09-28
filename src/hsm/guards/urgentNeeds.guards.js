import { and, not, stateIn } from 'xstate';

const isFoodRestored = and([
  stateIn({ MAIN_ACTIVITY: { URGENT_NEEDS: 'EMERGENCY_EATING' } }),
  ({ context, event }) => context.food === 20
])

const isHealthRestored = and([
  stateIn({ MAIN_ACTIVITY: { URGENT_NEEDS: 'EMERGENCY_HEALING' } }),
  ({ context, event }) => {
    return context.health >= 18
  }
])

export default {
  isFoodRestored,
  isHealthRestored,
}