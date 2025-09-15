import { states } from "../../config/states.js";
import { BaseState } from "./BaseState.js";
import logger from "../../config/logger.js";
import { GoalNear } from '../plugins/goals.js'

export class SurvivalState extends BaseState {
  constructor(fsm) {
    super(fsm, states.SURVIVAL, 6)
  }

  enter(bot) {
    bot.chat(`Режим выживания: ${bot.health.toFixed(0)} - здоровье, ${bot.food} - голод, ${bot.foodSaturation} - сытость`)
    this.update(bot)
  }

  update(bot) {
    clearTimeout(this._timerUpdate)

    const eatStatus = bot.utils.needsToEat()
    if (eatStatus.shouldEat) {
      bot.autoEat.eat({
        equipOldItem: true,      // вернуть предмет после еды
        priority: 'saturation',   // бот выбирает еду, которая даёт максимальное насыщение
        offhand: true, // бот будет использовать вторую руку
      }).catch(err => {
        if (err.message.toString().toLowerCase().includes('no food')) {
          // bot.chat('Не могу найти еду! 😿')
        }
      })
    } else {
      if (this.fsm.previousState === states.COMBAT && bot.utils.findNearestEnemy()) {
        this.fsm.transition(states.COMBAT)
      } else {
        this.fsm.transition(states.IDLE)
      }
      return
    }

    const enemy = bot.utils.findNearestEnemy(10)
    if (enemy && (eatStatus.priority === 'high' || eatStatus.priority === 'critical')) {
      // Убегаем от врага во время лечения
      const escapeX = bot.entity.position.x + (bot.entity.position.x - enemy.position.x)
      const escapeZ = bot.entity.position.z + (bot.entity.position.z - enemy.position.z)

      bot.pathfinder.setGoal(new GoalNear(escapeX, bot.entity.position.y, escapeZ, 1))
      bot.chat('Убегаю от врага! 🏃‍♂️')
    }

    this._timerUpdate = setTimeout(() => this.update(bot), this._timeout)
  }

  exit(bot) {
    clearTimeout(this._timerUpdate)
    this._timerUpdate = null
  }
}