const entryEmergencyEating = ({ context, event }) => {
  console.log('Вход в состояние EMERGENCY_EATING')
  context.bot.utils.eating()
}

const entryEmergencyHealing = ({ context, event }) => {
  console.log('Вход в состояние EMERGENCY_HEALING')
  context.bot.utils.eating()
}

export default {
  entryEmergencyEating,
  entryEmergencyHealing,
}