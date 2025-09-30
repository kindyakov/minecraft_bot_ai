import { assign, raise } from "xstate"

const analyzeCombat = raise(({ context }) => {
  const { health, prevCombatState = {}, preferences = {}, nearestEnemy = {} } = context

  if (!nearestEnemy?.entity || nearestEnemy.distance > preferences.maxDistToEnemy) {
    return { type: 'NO_ENEMIES' }
  }

  // Определяем тип изменения
  const changes = {
    targetChanged: nearestEnemy.entity.id !== prevCombatState.enemyId,
    becameFar: prevCombatState.distance <= 5 && nearestEnemy.distance > 8,
    becameClose: prevCombatState.distance > 8 && nearestEnemy.distance <= 5,
    healthCritical: prevCombatState.health > 8 && health <= 8,
    healthRestored: prevCombatState.health <= 8 && health > 8
  }

  if (changes.healthCritical) {
    return { type: 'HEALTH_CRITICAL' }
  } else if (changes.healthRestored) {
    return { type: 'HEALTH_RESTORED' }
  }

  // Отправляем специфичные события
  if (changes.targetChanged) {
    return { type: 'TARGET_CHANGED', distance: nearestEnemy.distance }
  } else if (changes.becameFar) {
    return { type: 'ENEMY_BECAME_FAR' }
  } else if (changes.becameClose) {
    return { type: 'ENEMY_BECAME_CLOSE' }
  }

  if (changes.healthCritical) {
    return { type: 'HEALTH_CRITICAL' }
  } else if (changes.healthRestored) {
    return { type: 'HEALTH_RESTORED' }
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