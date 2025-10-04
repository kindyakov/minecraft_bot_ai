const exitCombat = ({ context: { bot } }) => {
  console.log('⚔️ Выход из COMBAT')
}

const exitDeciding = () => {
  console.log('🤔⚔️ Выход из состояния DECIDING')
}

const exitFleeing = ({ context: { bot }, event }) => {
  bot.pathfinder.setGoal(null)
  console.log('🏃 Выход из состояния FLEEING')
}

const exitMeleeAttack = ({ context: { bot }, event }) => {
  console.log('🆑 Очистка боя')
  bot.pvp.stop()
  bot.pathfinder.setGoal(null)
  console.log('⚔️ Выход из состояния MELEE_ATTACKING')
}

const exitRangedAttacking = ({ context: { bot }, event }) => {
  bot.hawkEye.stop()
  bot.pathfinder.setGoal(null)
  console.log('🏹 Выход из состояния RANGED_ATTACKING')
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