const exitEmergencyEating = ({ context: { bot } }) => {
  console.log('✅ Выход из EMERGENCY_EATING 🥩')
  bot.pathfinder.setGoal(null)
  bot.utils.stopEating()
}

const exitEmergencyHealing = ({ context: { bot } }) => {
  console.log('✅ Выход из EMERGENCY_HEALING 💗')
  bot.pathfinder.setGoal(null)
  bot.utils.stopEating()
}

export default {
  exitEmergencyEating,
  exitEmergencyHealing
}