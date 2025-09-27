const entryEvaluateCombatSituation = ({ context, event }) => {
  const enemy = context.bot.utils.findNearestEnemy(context.preferences.maxDistToEnemy)
  if (!enemy) {

    return
  }

  const isMelee = enemy.position.distanceTo(context.position) < 7

  if (isMelee) {

  } else {

  }
}

const entryMeleeAttacking = ({ context, event }) => { }
const entryRangedAttacking = ({ context, event }) => { }

export default {
  entryEvaluateCombatSituation,
  entryMeleeAttacking,
  entryRangedAttacking,
}