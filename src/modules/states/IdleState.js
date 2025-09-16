import { BaseState } from "./BaseState.js";
import { STATES_TYPES } from "./index.states.js";

export class IdleState extends BaseState {
  constructor(fsm) {
    super(fsm, STATES_TYPES.IDLE, 1)
  }

  enter(bot, options = {}) {
    bot.chat('Я в состоянии ожидания 😴')
    this.status = 'active'
    this.update(bot)
  }

  update(bot) {
    clearTimeout(this._timerUpdate)

    const eatStatus = bot.utils.needsToEat()
    if (eatStatus.shouldEat && eatStatus.priority === 'critical') {
      console.log(`IdleState: priority - ${eatStatus.priority}`)
      this.fsm.transition(STATES_TYPES.SURVIVAL)
      return
    }

    const enemy = bot.utils.findNearestEnemy()
    if (enemy) {
      this.fsm.transition(STATES_TYPES.COMBAT, { enemy })
      return
    }

    const player = bot.utils.searchNearestPlayer()
    if (player) {
      bot.lookAt(player.position.offset(0, 1.6, 0))
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