import { BaseTask } from './BaseTask.js'
import { TASK_TYPES } from './index.tasks.js'

export class NeedFoodTask extends BaseTask {
  constructor(fsm, data) {
    super(TASK_TYPES.NEED_FOOD, data)
    this.fsm = fsm
  }

  canExecute(bot) {
  }

  async execute(bot) {
    this.isRunning = true
    this.progress = { stage: 'starting', completion: 0 }

  }
}