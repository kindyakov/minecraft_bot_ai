import { assign } from "xstate"

const exitCombat = assign(({ context }) => {
  console.log('⚔️ Выход из COMBAT')
  return {
    previousCombatState: {
      enemyId: null,
      distance: null,
      health: context.health
    }
  }
})

const exitMeleeAttack = ({ context: { bot }, event }) => {
  console.log('🏹 Выход из состояния MELEE_ATTACKING')

  bot.pvp.stop()
  bot.pathfinder.setGoal(null)
}

const exitRangedAttacking = ({ context: { bot }, event }) => {
  console.log('🏹 Выход из состояния RANGED_ATTACKING')

  bot.utils.stopShoot()
  bot.pathfinder.setGoal(null)
}

export default {
  exitCombat,
  exitMeleeAttack,
  exitRangedAttacking,
}