import { BaseTask } from "./BaseTask.js"
import { TASK_TYPES } from './index.tasks.js'

export class RepairArmorTask extends BaseTask {
  constructor(data) {
    super(TASK_TYPES.REPAIR_ARMOR, data)
  }

  canExecute(bot) {

  }

  execute(bot) {
    // починку: позже сделаю
  }
}