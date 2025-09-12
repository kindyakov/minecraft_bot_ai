import { BaseCommand } from "./BaseCommand.js";
import { GoalNear, GoalFollow } from "../../navigation/goals.js";

class Guard extends BaseCommand {
  constructor() {
    super('guard')
    this.isActive = false
  }

  execute({ bot }) {
    bot.armorManager?.equipAll() // Бот при наличии брони в инвенторе наденет её

    const currentPos = bot.entity?.position
    const entity = bot.nearestEntity()

    const { x, y, z } = entity.position

    const goal = new GoalNear(x, y, z, 1)
    // bot.pathfinder.setGoal(goal, true)
    bot.attack(entity)

    bot.cmdState?.registerCommand(this)
    this.isActive = true
  }

  stop(bot) {
    bot?.cmdState?.unregisterCommand(this)
    this.isActive = false
  }
}

export const guard = new Guard()