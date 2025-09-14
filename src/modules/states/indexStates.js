import { states } from '../../config/states.js'
import { IdleState } from './IdleState.js'
import { SurvivalState } from './SurvivalState.js'
import { CombatState } from './CombatState.js'

export const indexStates = {
  [states.IDLE]: IdleState,
  [states.SURVIVAL]: SurvivalState,
  [states.COMBAT]: CombatState,
}
