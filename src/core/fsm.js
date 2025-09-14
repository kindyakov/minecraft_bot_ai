import EventEmitter from 'node:events';
import logger from './logger.js';
import { states } from '../config/states.js'
import { indexStates } from '../modules/states/indexStates.js'

class BotStateMachine extends EventEmitter {
  constructor(bot) {
    super()
    this.bot = bot
    this.states = indexStates
    this.state = null
    this.transition(states.IDLE)
  }

  transition(newStateName, data = {}) {
    if (this.state?.name === newStateName) {
      logger.info(`Бот уже в состоянии ${newStateName}`)
      return
    }

    if (this.state?.exit) {
      this.state.exit(this.bot)
    }

    if (!this.states[newStateName]) {
      logger.error(`Состояние ${newStateName} не найдено`)
      return
    }

    this.state = new this.states[newStateName](this);
    this.state.enter(this.bot, data)

    logger.info(`FSM: ${this.state.name} → ${newStateName}`);
  }
}

export default BotStateMachine