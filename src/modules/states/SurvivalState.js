import { BaseState } from "./BaseState.js";
import { STATES_TYPES } from "./index.states.js";
import logger from "../../config/logger.js";
import { GoalNear } from '../plugins/goals.js'

export class SurvivalState extends BaseState {
  constructor(fsm) {
    super(fsm, STATES_TYPES.SURVIVAL, 6)
  }

  enter(bot) {
    bot.chat(`Режим выживания: ${bot.health.toFixed(0)} - здоровье, ${bot.food} - голод, ${bot.foodSaturation} - сытость`)
    this.status = 'active'
    this.update(bot)
  }

  update(bot) {
    clearTimeout(this._timerUpdate)

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
    this.status = 'inactive'
  }

  pause() {
    this.status = 'pause'
  }

  resume() {
    this.status = 'active'
  }
}