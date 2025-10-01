const exitCombat = ({ context: { bot } }) => {
  console.log('⚔️ Выход из COMBAT')

  bot.pvp.stop()
  bot.hawkEye.stop()
  bot.pathfinder.setGoal(null)
  bot.utils.stopEating()
}

const exitDeciding = () => {
  console.log('🤔⚔️ Выход из состояния DECIDING')
}

const exitFleeing = ({ context: { bot }, event }) => {
  console.log('🏃 Выход из состояния FLEEING')

  bot.pathfinder.setGoal(null)
  bot.utils.stopEating()
}

const exitMeleeAttack = ({ context: { bot }, event }) => {
  console.log('⚔️ Выход из состояния MELEE_ATTACKING')

  bot.pvp.stop()
  bot.pathfinder.setGoal(null)
}

const exitRangedAttacking = ({ context: { bot }, event }) => {
  console.log('🏹 Выход из состояния RANGED_ATTACKING')

  bot.hawkEye.stop()
  bot.pathfinder.setGoal(null)
}

const exitDefending = () => {
  console.log('🤔⚔️ Выход из состояния DEFENDING')
}

export default {
  exitCombat,
  exitDeciding,
  exitFleeing,
  exitMeleeAttack,
  exitRangedAttacking,
  exitDefending,
}