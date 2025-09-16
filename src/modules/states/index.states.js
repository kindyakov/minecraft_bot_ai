import { IdleState } from './IdleState.js'
import { SurvivalState } from './SurvivalState.js'
import { CombatState } from './CombatState.js'

export const STATES_TYPES = {
  IDLE: 'idle',
  FOLLOW: 'follow',
  COMBAT: 'combat',
  FARM: 'farm',
  MINE: 'mine',
  BUILD: 'build',
  SURVIVAL: 'survival'
}

export const STATES = {
  [STATES_TYPES.IDLE]: IdleState,
  [STATES_TYPES.SURVIVAL]: SurvivalState,
  [STATES_TYPES.COMBAT]: CombatState,
}
