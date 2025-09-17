import { BaseState } from "./BaseState.js"
import { STATES_TYPES } from "./index.states.js"
import { GoalFollow } from "../plugins/goals.js"
import { AntiStuck } from "../../utils/minecraft/AntiStuck.js"

export class FollowState extends BaseState {
  constructor(fsm) {
    super(fsm, STATES_TYPES.FOLLOW, 9)
    this.targetEntity = null
    this.antiStuck = null
  }

  enter(bot, data) {
    this.status = 'active'
    this.antiStuck = new AntiStuck(bot)

    if (bot.movements) {
      bot.movements.allowParkour = true
      bot.movements.allow1by1towers = true
    }

    this.antiStuck.start(
      (stuckInfo) => this.handleStuck(stuckInfo),
      () => bot.chat('Больше не застрял!')
    )

    this.update(bot, data)
  }

  update(bot, { username, ...options }) {
    this.targetEntity = this.targetEntity ? this.targetEntity : bot.utils.searchPlayer(options[0] || username)

    if (!this.targetEntity) {
      bot.chat('Я тебя не вижу!')
      this.fsm.transition()
      return
    }

    console.log(`FollowState: бот следует за ${this.targetEntity.username}`)

    bot.lookAt(this.targetEntity.position.offset(0, 1.6, 0))

    bot.utils.lastMovingAt = Date.now()
    bot.pathfinder.setGoal(new GoalFollow(this.targetEntity, 2), true)
  }

  handleStuck(stuckInfo) {
    const { attempts, maxAttempts } = stuckInfo

    this.fsm.bot.chat(`Застрял! Попытка ${attempts}/${maxAttempts}`)

    if (attempts >= maxAttempts) {
      this.fsm.bot.chat('Не могу добраться!')
      this.fsm.transition(STATES_TYPES.IDLE)
      return
    }

    // Применяем стратегии восстановления
    const strategies = [
      () => AntiStuck.recoveryStrategies.jump(this.fsm.bot),
      () => AntiStuck.recoveryStrategies.resetPath(this.fsm.bot,
        new GoalFollow(this.targetEntity, 2)),
      () => AntiStuck.recoveryStrategies.backUp(this.fsm.bot)
    ]

    strategies[attempts - 1]?.()
  }

  exit(bot) {
    clearTimeout(this._timerUpdate)
    bot.pathfinder.setGoal(null)
    bot.look(0, 0, true)
    this.targetEntity = null
    this.status = 'inactive'
    this.antiStuck?.stop()
  }

  pause(bot) {
    this.status = 'pause'
  }

  resume(bot) {
    this.status = 'active'
  }
}