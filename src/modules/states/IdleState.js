import { BaseState } from "./BaseState.js";
import { states } from "../../config/states.js";

export class IdleState extends BaseState {
  constructor(fsm) {
    super(states.IDLE)
    this.timer = null
    this.fsm = fsm
  }

  enter(bot, options = {}) {
    bot.chat('Я в состоянии ожидания 😴')

    this.update(bot)
  }

  update(bot) {
    clearTimeout(this.timer)

    const enemy = bot.nearestEntity(e => e.type === 'hostile')
    if (enemy) {
      this.fsm.transition(states.GUARD, { enemy })
      return
    }
    const inventory = bot.inventory.items()

    if (inventory.length >= 36) {

      return  // переход в другое состояние
    }

    // проверка голода
    if (bot.food <= 17) {

      return // переход в другое состояние
    }

    // проверка здоровья
    if (bot.health <= 15 && bot.foodSaturation < 5) {

      return   // переход в другое состояние
    }

    this.timer = setTimeout(() => this.update(bot), 1000)
  }

  exit(bot) {
    clearTimeout(this.timer)
    this.timer = null
  }
}