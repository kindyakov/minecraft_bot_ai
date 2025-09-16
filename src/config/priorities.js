import { STATES_TYPES } from '../modules/states/index.states.js'

export const PRIORITY_LEVELS = {
  COMMAND: 10,
  [STATES_TYPES.FOLLOW]: 9,
  [STATES_TYPES.BUILD]: 7,
  [STATES_TYPES.MINE]: 7,
  [STATES_TYPES.FARM]: 7,
  [STATES_TYPES.COMBAT]: 6,
  [STATES_TYPES.IDLE]: 1
}

// Пороговые значения для SurvivalSystem
export const SURVIVAL_THRESHOLDS = {
  HEALTH: {
    CRITICAL: 3,    // < 3 сердец = критично
    HIGH: 5,        // < 5 сердец = высокий приоритет  
    MEDIUM: 8       // < 8 сердец = средний приоритет
  },
  FOOD: {
    CRITICAL: 0,    // 0 еды = критично
    HIGH: 5,        // < 5 еды = высокий приоритет
    MEDIUM: 8       // < 8 еды = средний приоритет  
  }
}