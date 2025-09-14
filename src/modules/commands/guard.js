import Logger from "../../config/logger.js";
import { BaseCommand } from "./BaseCommand.js";
import { GoalFollow, GoalBlock } from "../plugins/goals.js";

class Guard extends BaseCommand {
  constructor() {
    super('guard')
    this.isActive = false
    this.patrolInterval = null
    this.center = null
    this.distancePatrol = 50
    this.currentEnemy = null
    this.isReturning = false
    this.ignoredMobs = new Set()
    this._lastMovingAt = Date.now()
    this._stuckTimeout = 4000
    this._goalReachedHandler = null
    this._debugMode = false
  }

  execute({ bot }) {
    if (this.isActive) {
      this.stop(bot)
    }

    const weapon = bot.utils.searchWeapons(bot) // поиск оружия меч/топор
    if (weapon) {
      bot.equip(weapon, 'hand')
    }

    bot.armorManager.equipAll() // Бот при наличии брони в инвенторе наденет её
    this.center = bot.entity?.position
    this.isActive = true
    bot.cmdState?.registerCommand(this)

    if (bot.movements) {
      bot.movements.allowSprinting = true // Разрешаем боту бежать        
    }

    if (!bot.pathfinder) {
      Logger.error('Не обнаружен модуль pathfinder!')
      return
    }

    this.findEnemies(bot)
  }

  stop(bot) {
    clearInterval(this.patrolInterval)
    this.patrolInterval = null
    this.center = null
    this.isActive = false
    this.isReturning = false
    this.currentEnemy = null
    this.ignoredMobs.clear()
    this._clearGoalHandler(bot)
    bot.pathfinder.setGoal(null)
    bot.cmdState?.unregisterCommand(this)
  }

  findEnemies(bot) {
    clearInterval(this.patrolInterval)

    this.patrolInterval = setInterval(() => {
      if (this.currentEnemy) {
        this._debugMode && Logger.info('есть активная цель')
        return
      }

      this._debugMode && Logger.info('Ищу врагов')

      this.currentEnemy = bot.nearestEntity(e => {
        return e.type === 'hostile' && !this.ignoredMobs.has(e.id)
      }) // фильтрация по типу враждебным мобам

      if (!this.currentEnemy) {
        this._debugMode && Logger.info('Враг не найден')
        this.returnToCenter(bot)
        return
      }

      this._debugMode && Logger.info('Врага нашел')

      if (!this.sWithinPatrolArea(bot, this.currentEnemy)) {
        this._debugMode && Logger.info('Враг вне зоны патрулирования')
        this.returnToCenter(bot)
        this.currentEnemy = null
        return
      }

      // Удаляем обработчик события goal_reached
      this._clearGoalHandler(bot)

      this.isReturning = false
      this._lastMovingAt = Date.now()
      bot.pathfinder.setGoal(new GoalFollow(this.currentEnemy, 2), true)

      // Отвечает за атаку врагов
      this.attackEnemies(bot)
    }, 1000)
  }

  _clearGoalHandler(bot) {
    if (this._goalReachedHandler) {
      bot.off('goal_reached', this._goalReachedHandler)
      this._goalReachedHandler = null
    }
  }

  returnToCenter(bot) {
    const distanceFromStartToBot = bot.entity.position.distanceTo(this.center)
    if (distanceFromStartToBot <= 1 || this.isReturning) return

    this._debugMode && Logger.info('Возвращаюсь в центр')
    this.isReturning = true

    // Отправляем бота на место старта
    bot.pathfinder.setGoal(new GoalBlock(this.center.x, this.center.y, this.center.z));

    this._goalReachedHandler = () => {
      this.isReturning = false
      this._debugMode && Logger.info('Достигнуто место патрулирования')
      this._clearGoalHandler(bot)
    }

    // Добавляем обработчик события goal_reached
    bot.once('goal_reached', this._goalReachedHandler)
  }

  sWithinPatrolArea(bot, enemy) {
    if (!this.center || !enemy) return false
    // Расстояние от бота до точки начало патрулирования
    const distanceFromStartToBot = bot.entity.position.distanceTo(this.center)
    // Расстояние от бота до моба
    const distanceToMob = enemy.position.distanceTo(this.center)

    // если моб находится дальше расстояния патрулирования нет смысла за ним бежать
    if (distanceToMob > this.distancePatrol) return false
    // проверка расстояния от точки патрулирования
    if (distanceFromStartToBot > this.distancePatrol) return false

    return true
  }

  attackEnemies(bot) {
    clearInterval(this.patrolInterval)

    const attackLoop = () => {
      if (!this.currentEnemy?.isValid || !this.isActive) {
        this.currentEnemy = null
        this._debugMode && Logger.info('Убил врага')
        this.findEnemies(bot)
        return
      }

      const distanceToMob = bot.entity.position.distanceTo(this.currentEnemy.position)
      if (distanceToMob <= 4) {
        bot.attack(this.currentEnemy)
      }

      if (bot.pathfinder.isMoving()) {
        this._lastMovingAt = Date.now()
      } else {
        if (Date.now() - this._lastMovingAt > this._stuckTimeout) {
          this.ignoredMobs.add(this.currentEnemy.id)
          bot.pathfinder.setGoal(null)

          this.currentEnemy = null
          this._debugMode && Logger.info('Этого врага не достать, ищу нового врага')
          this.findEnemies(bot)
          return
        }
      }

      setTimeout(attackLoop, 400)
    }

    attackLoop()
  }
}

export const guard = new Guard()