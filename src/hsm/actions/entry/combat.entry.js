import { assign } from "xstate"

const entryCombat = assign({
  combatContextChanged: false,
  currentEnemy: null
})

const entryDeciding = assign({
  combatContextChanged: false
})

const entryMeleeAttacking = ({ context, event }) => { }

const entryRangedAttacking = ({ context, event }) => { }

export default {
  entryCombat,
  entryDeciding,
  entryMeleeAttacking,
  entryRangedAttacking,
}