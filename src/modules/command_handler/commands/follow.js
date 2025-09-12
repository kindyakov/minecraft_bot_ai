import { BaseCommand } from './BaseCommand.js';
import { GoalFollow } from '../../navigation/goals.js';

class Follow extends BaseCommand {
  constructor() {
    super('follow')
    this.interval = null
    this.isActive = false
  }

  execute({ bot, username, options }) {
    if (this.isActive) {
      this.stop(bot)
    }

    const playerName = options[0] ? options[0] : username
    const target = bot.players[playerName]?.entity

    if (!target) {
      bot.chat("Я тебя не вижу")
      return
    }

    if (bot.movements) {
      bot.movements.allowSprinting = false // Разрешаем боту бежать        
    }

    bot.pathfinder.setGoal(new GoalFollow(target, 2), true)

    this.clearInterval()
    this.interval = setInterval(() => {
      const targetEntity = bot.players[playerName]?.entity

      if (!targetEntity) {
        bot.chat(`${playerName} отключился, перестаю следовать`)
        this.stop(bot)
        return
      }

      // Проверка "застрял ли бот": не движется и далеко от игрока
      const dist = bot.entity.position.distanceTo(targetEntity.position)
      if (!bot.pathfinder.isMoving() && bot.pathfinder.goal && dist > 8) {
        bot.chat("Я не могу дальше двигаться(")
        this.stop(bot)
      }
    }, 1000)


    bot.cmdState?.registerCommand(this)
    this.isActive = true
  }

  stop(bot) {
    this.clearInterval()
    this.isActive = false
    bot.pathfinder?.setGoal(null)
    bot.cmdState?.unregisterCommand(this)
  }

  clearInterval() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }
}

export const follow = new Follow()