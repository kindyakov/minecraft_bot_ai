import { BaseState } from "./BaseState.js";
import { STATES_TYPES } from "./index.states.js";
import { GoalFollow } from "../plugins/goals.js";
import logger from "../../config/logger.js";

export class CombatState extends BaseState {
  constructor(fsm) {
    super(fsm, STATES_TYPES.COMBAT, 6)
    this.currentEnemy = null
    this._debugMode = true
    this._timerAttack = null
    this._ignoredMobs = new Set()
  }

  enter(bot, { enemy }) {
    const weapon = bot.utils.searchWeapons()
    if (weapon) {
      bot.equip(weapon, 'hand')
    }

    if (bot.movements) {
      bot.movements.allowParkour = true
      bot.movements.allow1by1towers = true
      bot.movements.allowSprinting = false // Разрешаем боту бежать
    }

    bot.armorManager.equipAll() // Бот при наличии брони в инвенторе наденет её
    this.status = 'active'
    this.update(bot, enemy)
  }

  update(bot, enemy) {
    clearTimeout(this._timerUpdate)

    const eatStatus = bot.utils.needsToEat()
    if (eatStatus.shouldEat && eatStatus.priority === 'critical') {
      this.fsm.transition(STATES_TYPES.SURVIVAL)
      return
    }

    this.currentEnemy = enemy ? enemy : bot.utils.findNearestEnemy(
      30,
      e => !this._ignoredMobs.has(e.id)
    )

    if (!this.currentEnemy) {
      this.fsm.transition(this.fsm.previousStateName || STATES_TYPES.IDLE)
      return
    }

    bot.utils.lastMovingAt = Date.now()
    bot.lookAt(this.currentEnemy.position, true)
    bot.pathfinder.setGoal(new GoalFollow(this.currentEnemy, 3), true)

    this.attack(bot)
  }

  attack(bot) {
    clearTimeout(this._timerAttack)

    if (!this.currentEnemy?.isValid) {
      this.currentEnemy = null
      this._debugMode && logger.info('Убил врага')
      this.update(bot)
      return
    }

    const distanceToMob = bot.entity.position.distanceTo(this.currentEnemy.position)
    if (distanceToMob <= 4) {
      bot.attack(this.currentEnemy)
    }

    if (bot.pathfinder.isMoving()) {
      bot.utils.lastMovingAt = Date.now()
    } else {
      if (bot.utils.isStuck()) {
        this._ignoredMobs.add(this.currentEnemy.id)
        bot.pathfinder.setGoal(null)
        this.currentEnemy = null
        this.update(bot)
        return
      }
    }

    this._timerAttack = setTimeout(() => this.attack(bot), 400)
  }

  exit(bot) {
    clearTimeout(this._timerUpdate)
    this._timerUpdate = null

    clearTimeout(this._timerAttack)
    this._timerAttack

    this.currentEnemy = null
    this._ignoredMobs.clear()

    this.status = 'inactive'

    bot.pathfinder.setGoal(null)
  }

  pause(bot) {
    clearTimeout(this._timerUpdate)
    this.status = 'pause'
    this._timerUpdate = null
  }

  resume(bot) {
    this.status = 'active'
    this.update(bot, this.currentEnemy)
  }
}