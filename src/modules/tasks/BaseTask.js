import { generateId } from "../../utils/general/generateId.js"

export class BaseTask {
  constructor(type, data) {
    this.id = generateId()
    this.type = type           // 'REPAIR_ARMOR'
    this.priority = data.priority || 5   // 5, 6, 7
    this.data = data
    this.createdAt = Date.now()

    this.isRunning = false
    this.progress = { stage: 'pending', completion: 0 }
    this.abortController = new AbortController() // для отмены async операций
  }

  canExecute(bot) {
    throw new Error('canExecute() должно быть реализовано')
  }

  async execute(bot) {
    this.isRunning = true
    this.progress = { stage: 'starting', completion: 0 }
    throw new Error('execute() должно быть реализовано')
  }

  isExpired() {
    // Общая логика - задача устарела через 30 секунд
    return Date.now() - this.createdAt > 30000
  }

  stop() {
    this.isRunning = false
    this.abortController.abort()
    this.abortController = new AbortController()
    this.progress = { stage: 'stopped', completion: 0 }
  }

  completed() {
    throw new Error('completed() должно быть реализовано') //  this.fsm.emit('task-completed', this.type)
  }
}