function eating(bot) {
  if (!bot) return
  console.log('Ищу еду в инвентаре...')

  const foodInInventory = bot.utils.getAllFood()
  if (!foodInInventory.length) {
    bot.chat('Нет еды в инвентаре критическая ситуация!')
    console.log('Нет еды!')
    return
  }

  if (!bot.autoEat.isEating) {
    bot.autoEat.eat()
      .then(() => console.log(`Поел здоровье: ${bot.health}`))
      .catch(err => {
        logger.error(`entryEmergencyEating() Ошибка при еде: ${err.message}`)
      })
  }
}

const entryEmergencyEating = ({ context, event }) => {
  console.log(`Нужно поесть, здоровье: ${context.health}`)
  eating(context.bot)
}

const entryEmergencyHealing = ({ context, event }) => {
  console.log('Нужно полечится')
  eating(context.bot)
}

export default {
  entryEmergencyEating,
  entryEmergencyHealing,
}