import { BaseState } from "./BaseState.js";
import { states } from "../../config/states.js";
import { GoalFollow } from "../plugins/goals.js";
import logger from "../../config/logger.js";

export class CombatState extends BaseState {
  constructor(fsm) {
    super(fsm, states.COMBAT, 6)
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

    bot.armorManager.equipAll() // Бот при наличии брони в инвенторе наденет её

    this.update(bot, enemy)
  }

  update(bot, enemy) {
    clearTimeout(this._timerUpdate)

    const eatStatus = bot.utils.needsToEat()
    if (eatStatus.shouldEat && ['medium', 'high', 'critical'].includes(eatStatus.priority)) {
      this.fsm.transition(states.SURVIVAL)
      return
    }

    this.currentEnemy = enemy ? enemy : bot.utils.findNearestEnemy(
      30,
      e => !this._ignoredMobs.has(e.id)
    )

    if (!this.currentEnemy) {
      this.fsm.transition(states.IDLE)
      return
    }

    bot.utils.lastMovingAt = Date.now()
    bot.lookAt(this.currentEnemy.position)
    bot.pathfinder.setGoal(new GoalFollow(this.currentEnemy, 2), true)

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

    bot.pathfinder.setGoal(null)
  }

  pause(bot) {
    clearTimeout(this._timerUpdate)
    this._timerUpdate = null
  }

  resume(bot) {
    this.update(bot, this.currentEnemy)
  }
}