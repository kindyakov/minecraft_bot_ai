const exitCombat = ({ context: { bot } }) => {
  console.log('⚔️ Выход из COMBAT')
}

const exitDeciding = () => {
  console.log('🤔⚔️ Выход из состояния DECIDING')
}

const exitFleeing = ({ context: { bot }, event }) => {
  console.log('🏃 Выход из состояния FLEEING')
}

const exitMeleeAttack = ({ context: { bot }, event }) => {
  console.log('⚔️ Выход из состояния MELEE_ATTACKING')
}

const exitRangedAttacking = ({ context: { bot }, event }) => {
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