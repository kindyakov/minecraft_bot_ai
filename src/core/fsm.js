import EventEmitter from 'node:events';
import logger from '../config/logger.js';
import { PRIORITY_LEVELS } from '../config/priorities.js';
import { STATES, STATES_TYPES } from '../modules/states/index.states.js'

class BotStateMachine extends EventEmitter {
  constructor(bot, taskManager) {
    super()
    this.bot = bot
    this.taskManager = taskManager
    this.states = STATES
    this.state = null
    this.previousStateName = ''
    this.init()
  }

  init() {
    this.handlers()
    this.transition(STATES_TYPES.IDLE)
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

    logger.info(`FSM: ${this.state?.name || '_'} → ${newStateName}`);
    this.previousStateName = this.state?.name || ''

    this.state = new this.states[newStateName](this);
    if (this.processTaskQueue()) return
    this.state.enter(this.bot, data)
  }

  resumeState(type) {
    this.taskManager.removeTask(type)
    this.taskManager.setActiveTaskType(null)

    if (this.state?.status === 'pause') {
      logger.info(`FSM: ${this.state.name}`);
      this.state.resume()
    } else {
      this.transition(STATES_TYPES.IDLE)
    }
  }

  processTaskQueue() {
    const nextTask = this.taskManager.getNextTask()
    if (!nextTask) return false
    const currentPriority = PRIORITY_LEVELS[this.state.name] || 7

    if (nextTask.priority > currentPriority) {
      this._startTask(nextTask.type)
      return true
    } else {
      return false
    }
  }

  _startTask(taskType) {
    console.log(`FSM: запускаю задачу ${taskType}`)
    this.state.pause(this.bot)
    this.taskManager.setActiveTaskType(taskType)
    this.taskManager.startTask(taskType, this.bot)
  }

  handlers() {
    this.on('task-added', (type, priority) => {
      logger.info(`FSM: Добавлена задача '${type}'`)
      const currentPriority = PRIORITY_LEVELS[this.state.name] || 7
      if (priority > currentPriority) {
        this._startTask(type)
      }
    })

    this.on('task-completed', type => {
      logger.info(`FSM: Выполнена задача '${type}'`)
      this.resumeState(type)
    })

    this.on('task-failed', type => {
      logger.info(`FSM: Задача '${type}' не выполнена`)
      this.resumeState(type)
    })

    this.on('command', commandName => {
      if (this.taskManager.activeTaskType) {
        this.taskManager.stopTask() // прервать текущую задачу
      }

      // запук команды
    })

    this.on('death', () => {
      this.taskManager.clear()
      this.state?.exit(this.bot)
      this.state = null
      this.transition(STATES_TYPES.IDLE)
    })
  }
}

export default BotStateMachine