import { and, not, stateIn } from 'xstate';

const isFoodRestored = and([
  stateIn({ MAIN_ACTIVITY: { URGENT_NEEDS: 'EMERGENCY_EATING' } }),
  ({ context, event }) => context.food === context.preferences.foodRestored
])

const isHealthRestored = and([
  stateIn({ MAIN_ACTIVITY: { URGENT_NEEDS: 'EMERGENCY_HEALING' } }),
  ({ context, event }) => {
    return context.health >= context.preferences.healthFullyRestored
  }
])

export default {
  isFoodRestored,
  isHealthRestored,
}