import { assign, raise } from "xstate"

const analyzeCombat = ({ context }) => {
  const { health, prevCombatState = {}, preferences = {}, nearestEnemy = {} } = context

  if (!nearestEnemy?.entity || nearestEnemy.distance > preferences.maxDistToEnemy) {
    raise({ type: 'NO_ENEMIES' })
    return
  }

  // Определяем тип изменения
  const changes = {
    targetChanged: nearestEnemy.entity.id !== prevCombatState.enemyId,
    becameFar: prevCombatState.distance <= 5 && nearestEnemy.distance > 8,
    becameClose: prevCombatState.distance > 8 && nearestEnemy.distance <= 5,
    healthCritical: prevCombatState.health > 8 && health <= 8,
    healthRestored: prevCombatState.health <= 8 && health > 8
  }

  // Отправляем специфичные события
  if (changes.targetChanged) {
    raise({ type: 'TARGET_CHANGED', distance: nearestEnemy.distance })
  } else if (changes.becameFar) {
    raise({ type: 'ENEMY_BECAME_FAR' })
  } else if (changes.becameClose) {
    raise({ type: 'ENEMY_BECAME_CLOSE' })
  }

  if (changes.healthCritical) {
    raise({ type: 'HEALTH_CRITICAL' })
  } else if (changes.healthRestored) {
    raise({ type: 'HEALTH_RESTORED' })
  }
}

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