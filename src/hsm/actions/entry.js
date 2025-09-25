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
const entryEmergencyEating = ({ context, event }) => {
  console.log('Нужно поесть')
}

const entryEmergencyHealing = ({ context, event }) => {
  console.log('Нужно полечится')
}

const saveMiningProgress = ({ context, event }) => { }
const saveBuildingProgress = ({ context, event }) => { }
const saveFarmingProgress = ({ context, event }) => { }

export default {
  entryMining,
  entryFarming,
  entryBuilding,
  entrySleeping,
  entryFollowing,
  entrySheltering,

  entryMeleeAttacking,
  entryRangedAttacking,
  entryEmergencyEating,
  entryEmergencyHealing,

  saveMiningProgress,
  saveBuildingProgress,
  saveFarmingProgress
}