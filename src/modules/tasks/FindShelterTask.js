import { BaseTask } from "./BaseTask.js"
import { TASK_TYPES } from './index.tasks.js'

export class FindShelterTask extends BaseTask {
  constructor(data) {
    super(TASK_TYPES.FIND_SHELTER, data)
  }

  canExecute(bot) {

  }

  execute(bot) {
    // позже сделаю
  }
}