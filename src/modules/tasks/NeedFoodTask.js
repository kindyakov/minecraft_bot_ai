import { BaseTask } from './BaseTask.js'
import { TASK_TYPES } from './index.tasks.js'

export class NeedFoodTask extends BaseTask {
  constructor(data) {
    super(TASK_TYPES.NEED_FOOD, data)
  }

  canExecute(bot) {

  }

  execute(bot) {
    // поиск еду: позже сделаю
  }
}