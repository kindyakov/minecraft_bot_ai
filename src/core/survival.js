import logger from '../config/logger.js'
import { TASK_TYPES } from '../modules/tasks/index.tasks.js'

class SurvivalSystem {
  constructor(bot, taskManager) {
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
    // offhand: true, // бот будет использовать вторую руку
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

  }

  checkHealth() {
    logger.info(`SurvivalSystem: здоровье ${this.bot.health.toFixed(0)}`)

    if (this.bot.foodSaturation > 0) return // Если сытость выше 0 то нечего делать не надо

    const foodInInventory = this.bot.utils.getAllFood()

    if (!foodInInventory.length) {
      if (this.bot.utils.needsHealing(5)) {
        this.bot.chat('Я вот-вот умру! 🤕')
        // this.taskManager.addTask(TASK_TYPES.NEED_FOOD, { priority: 8 })
        return
      } else {
        // this.taskManager.addTask(TASK_TYPES.NEED_FOOD, { priority: 5 })
        return
      }
    }

    if (!this.bot.autoEat.isEating && this.bot.utils.needsHealing(17)) {
      console.log(`SyrvivalSystem: checkHealth() кушаю`)
      this.bot.autoEat.eat(this.optionsAutoEat).catch(err => {
        logger.error(`SyrvivalSystem: checkHealth() Ошибка при еде: ${err.message}`)
      })
    }
  }

  checkFood() {
    const foodInInventory = this.bot.inventory.items().filter(item =>
      this.bot.autoEat.foodsByName[item.name]
    )

    if (!foodInInventory.length) {
      // добавить задачу
      return
    }

    if (!this.bot.autoEat.isEating && this.bot.utils.needsFood(17)) {
      logger.info(`SurvivalSystem: checkFood голод ${this.bot.food}`)
      console.log(`SyrvivalSystem: checkFood() кушаю`)
      this.bot.autoEat.eat(this.optionsAutoEat).catch(err => {
        logger.error(`Ошибка при еде: ${err.message}`)
      })
    }
  }

  checkTools() {

  }

  checkArmor() {
    const helmet = this.bot.inventory.slots[5]      // шлем
    const chestplate = this.bot.inventory.slots[6]  // нагрудник  
    const leggings = this.bot.inventory.slots[7]    // поножи
    const boots = this.bot.inventory.slots[8]       // ботинки
    const shield = this.bot.inventory.slots[45]     // щит/оффхенд

    // console.log(helmet.maxDurability)
  }
}

export default SurvivalSystem