import logger from '../../config/logger.js'
import { TASKS } from "./index.tasks.js"

export class TaskManager {
  constructor() {
    this.fsm = null
    this.tasks = []
    this.activeTasks = new Set()
    this.activeTaskType = null
  }

  setFsm(fsm) {
    this.fsm = fsm
  }

  setActiveTaskType(type) {
    this.activeTaskType = type
  }

  addTask(type, data) {
    if (!this.fsm) {
      logger.error('FSM не установлен. Добавьте FSM с помощью setFsm(fsm)')
      return
    }

    if (!TASKS[type]) {
      logger.error(`Задача ${type} не найдена`)
      return
    }

    if (this.hasTask(type)) return

    const task = new TASKS[type](this.fsm, data)
    this.tasks.push(task)
    this.activeTasks.add(type)

    this.fsm.emit('task-added', type, data.priority)
  }

  getNextTask() {
    if (this.tasks.length === 0) return null
    // Сортировка по приоритету (8 > 7 > 6 > 5)
    return this.tasks.sort((a, b) => b.priority - a.priority)[0]
  }

  searchTask(type) {
    if (!type) return
    const task = this.tasks.find(task => task.type === type)

    if (!task) {
      logger.error(`TaskManager: Задача ${type} не найдена`)
      return null
    }

    return task
  }

  hasTask(type) {
    return this.activeTasks.has(type)
  }

  startTask(type, bot) {
    if (!type) {
      logger.error('TaskManager: Не передана задача')
      return
    }

    const task = this.searchTask(type)
    task?.execute(bot)
  }

  stopTask(type = this.activeTaskType) {
    const task = this.searchTask(type)
    if (!task) return

    if (task.stop) {
      task.stop()
      this.activeTaskType = null
      logger.info(`TaskManager: Задача ${task.type} остановлена`)
    } else {
      logger.error(`TaskManager: Метод stop() не реализован в задаче '${task.type}'`)
    }
  }

  removeTask(type) {
    if (!this.hasTask(type)) return
    this.activeTasks.delete(type)
    this.tasks = this.tasks.filter(task => task.type !== type)
  }
}