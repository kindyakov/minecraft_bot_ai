const exitEmergencyEating = ({ context }) => {
  console.log('Выход из состояние EMERGENCY_EATING')
  context.bot.utils.stopEating()
}

const exitEmergencyHealing = ({ context }) => {
  console.log('Выход из состояние EMERGENCY_HEALING')
  context.bot.utils.stopEating()
}

export default {
  exitEmergencyEating,
  exitEmergencyHealing
}