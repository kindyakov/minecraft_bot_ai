import { BaseState } from "./BaseState.js"
import { STATES_TYPES } from "./index.states.js"

export class FollowState extends BaseState {
  constructor(fsm) {
    super(fsm, STATES_TYPES.FOLLOW, 5)
  }

  enter(bot, options = {}) {
    bot.chat('Я в состоянии следования 👀')
    this.status = 'active'

    // bot.pathfinder.setGoal()
  }

  exit(bot) {
    bot.pathfinder.setGoal(null)
    this.status = 'inactive'
  }

  pause() {
    this.status = 'pause'
  }

  resume() {
    this.status = 'active'
  }
}