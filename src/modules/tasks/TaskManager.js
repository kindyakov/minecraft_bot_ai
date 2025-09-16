import logger from '../../config/logger.js'
import { TASKS } from "./index.tasks.js"

export class TaskManager {
  constructor() {
    this.fsm = null
    this.tasks = []
    this.activeTasks = new Set()
  }

  setFsm(fsm) {
    this.fsm = fsm
  }

  addTask(type,) {
    if (!this.fsm) {
      logger.error('FSM не установлен. Добавьте FSM с помощью setFsm(fsm)')
      return
    }

    if (!TASKS[type]) {
      logger.error(`Задача ${type} не найдена`)
      return
    }

    if (this.hasTask(type)) return

    const task = new TASKS[type](data)
    this.tasks.push(task)
    this.activeTasks.add(type)
    this.fsm.emit('addTask', this.tasks)
  }

  getNextTask() {

  }

  hasTask(type) {
    return this.activeTasks.has(type)
  }

  removeTask(type) {
    if (!this.hasTask(type)) return
    this.activeTasks.delete(type)
    this.tasks = this.tasks.filter(task => task.type !== type)
  }
}