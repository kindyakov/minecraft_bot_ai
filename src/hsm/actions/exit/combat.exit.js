const exitCombat = ({ context }) => {
  console.log('⚔️ Выход из COMBAT')
}

const exitMeleeAttack = ({ context: { bot }, event }) => {
  console.log('⚔️ Завершаю ближний бой')

  bot.pvp.stop()
  bot.pathfinder.setGoal(null)
}

const exitRangedAttacking = ({ context: { bot }, event }) => {
  console.log('🏹 Завершаю дальний бой')

  bot.utils.stopShoot()
  bot.pathfinder.setGoal(null)
}

export default {
  exitCombat,
  exitMeleeAttack,
  exitRangedAttacking,
}