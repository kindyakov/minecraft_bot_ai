const exitCombat = ({ context }) => {
  console.log('⚔️ Выход из COMBAT')
}

const exitMeleeAttack = ({ context: { bot }, event }) => {
  console.log('🏹 Выход из состояния MELEE_ATTACKING')

  bot.pvp.stop()
  bot.pathfinder.setGoal(null)
}

const exitRangedAttacking = ({ context: { bot }, event }) => {
  console.log('🏹 Выход из состояния RANGED_ATTACKING')

  bot.hawkEye.stop()
  bot.pathfinder.setGoal(null)
}

export default {
  exitCombat,
  exitMeleeAttack,
  exitRangedAttacking,
}