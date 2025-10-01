import { assign, raise } from "xstate"

const analyzeCombat = raise(({ context }) => {
  const { health, prevCombatState = {}, preferences = {}, nearestEnemy = {} } = context

  if (
    !nearestEnemy?.entity
    || nearestEnemy.distance > preferences.maxDistToEnemy
  ) {
    return { type: 'NO_ENEMIES' }
  }

  // Определяем тип изменения
  const changes = {
    targetChanged: nearestEnemy.entity.id !== prevCombatState.enemyId,

    becameFar: prevCombatState.distance <= preferences.enemyMeleeRange
      && nearestEnemy.distance > preferences.enemyRangedRange,

    becameClose: prevCombatState.distance > preferences.enemyRangedRange
      && nearestEnemy.distance <= preferences.enemyMeleeRange,

    healthCritical: prevCombatState.health > preferences.healthCritical
      && health <= preferences.healthCritical,

    healthRestored: prevCombatState.health <= preferences.healthRestored
      && health > preferences.healthRestored
  }

  // Отправляем специфичные события

  if (changes.targetChanged) {
    return { type: 'TARGET_CHANGED', distance: nearestEnemy.distance }
  }

  if (changes.healthCritical) {
    return { type: 'HEALTH_CRITICAL' }
  } else if (changes.healthRestored) {
    return { type: 'HEALTH_RESTORED' }
  }

  if (changes.becameFar) {
    return { type: 'ENEMY_BECAME_FAR' }
  } else if (changes.becameClose) {
    return { type: 'ENEMY_BECAME_CLOSE' }
  }

  return {}
})

const savePrevCombatState = assign(({ context }) => ({
  prevCombatState: {
    enemyId: context.nearestEnemy?.entity?.id || null,
    distance: context.nearestEnemy?.distance || Infinity,
    health: context.health
  }
}))

export default {
  analyzeCombat,
  savePrevCombatState
}