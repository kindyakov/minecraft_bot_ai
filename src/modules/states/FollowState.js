export class FollowState extends BaseState {
  constructor(fsm) {
    super(fsm, states.FOLLOW, 5)
  }

  enter(bot, options = {}) {
    bot.chat('Я в состоянии следования 👀')
    // bot.pathfinder.setGoal()
  }

  exit(bot) {
    bot.pathfinder.setGoal(null)
  }
}