import logger from '../config/logger.js'
import { TASK_TYPES } from '../modules/tasks/index.tasks.js'

class SurvivalSystem {
  constructor(bot, taskManager) {
    super()
    this.bot = bot
    this.taskManager = taskManager
    this._timerArmor = null
    this._timerTools = null
    this._timerFood = null
    this.init()
  }

  optionsAutoEat = {
    equipOldItem: true,      // вернуть предмет после еды
    priority: 'saturation',   // бот выбирает еду, которая даёт максимальное насыщение
    offhand: true, // бот будет использовать вторую руку
  }

  init() {
    clearInterval(this._timerFood)
    clearInterval(this._timerTools)
    clearInterval(this._timerArmor)

    this.setupEventHandlers()
    this.startTimers()
  }

  setupEventHandlers() {
    this.bot.on('health', this.checkHealth.bind(this))
    this.bot.on('death', this.handleDeath.bind(this))
    this.bot.on('playerCollect', this.checkInventoryChanges.bind(this))
  }

  startTimers() {
    this._timerFood = setInterval(() => {
      this.checkFood()
    }, 5000)

    this._timerTools = setInterval(() => {
      this.checkTools()
    }, 10000)

    this._timerArmor = setInterval(() => {
      this.checkArmor()
    }, 15000)
  }

  handleDeath() {
    this.bot.chat('Я умер 😢')
    logger.info('Бот умер')
  }

  checkInventoryChanges(collector, collected) {
    console.log(collector, collected)
  }

  checkHealth() {
    if (this.bot.foodSaturation > 0) return // Если сытость выше 0 то нечего делать не надо

    const foodInInventory = this.bot.inventory.items().filter(item =>
      this.bot.autoEat.foodsByName[item.name]
    )

    if (!foodInInventory.length) {
      if (this.bot.health <= 5) {
        this.taskManager.addTask(TASK_TYPES.NEED_FOOD, { priority: 8 })
        this.bot.chat('Я вот-вот умру! 🤕')
        return
      } else {
        this.taskManager.addTask(TASK_TYPES.NEED_FOOD, { priority: 5 })
        return
      }
    }

    if (this.bot.health <= 17) {
      // bot.autoEat.eat(this.optionsAutoEat)
    }
  }

  checkFood() {
    const foodInInventory = this.bot.inventory.items().filter(item =>
      bot.autoEat.foodsByName[item.name]
    )

    if (!foodInInventory.length) {
      // Добавляем задачу в таск нет еды
      return
    }

    if (this.bot.food <= 17) {
      // bot.autoEat.eat(this.optionsAutoEat)
    }
  }

  checkTools() {

  }

  checkArmor() {
    const helmet = bot.inventory.slots[5]      // шлем
    const chestplate = bot.inventory.slots[6]  // нагрудник  
    const leggings = bot.inventory.slots[7]    // поножи
    const boots = bot.inventory.slots[8]       // ботинки
    const shield = bot.inventory.slots[45]     // щит/оффхенд
  }
}

export default SurvivalSystem