const exitCombat = ({ context: { bot } }) => {
  console.log('⚔️ Выход из COMBAT')

  bot.pvp.stop()
  bot.hawkEye.stop()
  bot.pathfinder.setGoal(null)
  bot.utils.stopEating()
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

const exitFleeing = ({ context: { bot }, event }) => {
  console.log('🏃 Выход из состояния FLEEING')

  bot.pathfinder.setGoal(null)
  bot.utils.stopEating()
}

export default {
  exitCombat,
  exitMeleeAttack,
  exitRangedAttacking,
  exitFleeing,
}