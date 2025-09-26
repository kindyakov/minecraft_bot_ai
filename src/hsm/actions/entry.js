// PEACEFUL
const entryIdle = ({ context, event }) => {

}

const entryMining = ({ context, event }) => { }

const entryFarming = ({ context, event }) => { }

const entryBuilding = ({ context, event }) => { }

const entrySleeping = ({ context, event }) => { }

const entryFollowing = ({ context, event }) => { }

const entrySheltering = ({ context, event }) => { }

// COMBAT
const entryMeleeAttacking = ({ context, event }) => { }
const entryRangedAttacking = ({ context, event }) => { }

// URGENT_NEEDS
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
// URGENT_NEEDS
const entryEmergencyEating = ({ context, event }) => {
  console.log(`Нужно поесть, здоровье: ${context.health}`)
  eating(context.bot)
}

const entryEmergencyHealing = ({ context, event }) => {
  console.log('Нужно полечится')
  eating(context.bot)
}

// TASKS
const entrySearchFood = ({ context, event }) => {
  console.log('Ищу еду...')
}

// PEACEFUL
const saveMiningProgress = ({ context, event }) => { }
const saveBuildingProgress = ({ context, event }) => { }
const saveFarmingProgress = ({ context, event }) => { }

export default {
  // PEACEFUL
  entryMining,
  entryFarming,
  entryBuilding,
  entrySleeping,
  entryFollowing,
  entrySheltering,

  // COMBAT
  entryMeleeAttacking,
  entryRangedAttacking,
  // URGENT_NEEDS
  entryEmergencyEating,
  entryEmergencyHealing,

  // TASKS
  entrySearchFood,

  // PEACEFUL
  saveMiningProgress,
  saveBuildingProgress,
  saveFarmingProgress
}