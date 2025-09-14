import { BaseState } from "./BaseState.js";
import { states } from "../../config/states.js";

export class IdleState extends BaseState {
  constructor(fsm) {
    super(fsm, states.IDLE)
  }

  enter(bot, options = {}) {
    bot.chat('Я в состоянии ожидания 😴')

    this.update(bot)
  }

  update(bot) {
    clearTimeout(this._timerUpdate)

    const eatStatus = bot.utils.needsToEat()
    if (eatStatus.shouldEat && ['medium', 'high', 'critical'].includes(eatStatus.priority)) {
      this.fsm.transition(states.SURVIVAL)
      return
    }

    const enemy = bot.utils.findNearestEnemy()
    if (enemy) {
      this.fsm.transition(states.COMBAT, { enemy })
      return
    }

    const player = bot.utils.searchNearestPlayer()
    if (player) {
      bot.lookAt(player.position)
    }

    this._timerUpdate = setTimeout(() => this.update(bot), this._timeout)
  }

  exit(bot) {
    clearTimeout(this._timerUpdate)
    this._timerUpdate = null
  }
}