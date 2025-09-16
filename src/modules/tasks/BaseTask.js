import { generateId } from "../../utils/general/generateId.js"

export class BaseTask {
  constructor(type, data) {
    this.id = generateId()
    this.type = type           // 'REPAIR_ARMOR'
    this.priority = data.priority || 5   // 5, 6, 7
    this.data = data
    this.createdAt = Date.now()
  }

  canExecute(bot) {
    throw new Error('canExecute() must be implemented')
  }

  execute(bot) {
    throw new Error('execute() must be implemented')
  }

  isExpired() {
    // Общая логика - задача устарела через 30 секунд
    return Date.now() - this.createdAt > 30000
  }
}