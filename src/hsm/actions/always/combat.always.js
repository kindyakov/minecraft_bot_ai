import { assign, raise } from "xstate"

const analyzeCombat = ({ context }) => {
  const { health, previousCombatState, preferences, nearestEnemy } = context

  if (!nearestEnemy || nearestEnemy?.distance > preferences.maxDistToEnemy) {
    raise({ type: 'NO_ENEMIES' })
    return {}
  }

  // Определяем тип изменения
  const changes = {
    targetChanged: nearestEnemy.entity.id !== previousCombatState.enemyId,
    becameFar: previousCombatState.distance <= 5 && nearestEnemy.distance > 8,
    becameClose: previousCombatState.distance > 8 && nearestEnemy.distance <= 5,
    healthCritical: previousCombatState.health > 8 && health <= 8,
    healthRestored: previousCombatState.health <= 8 && health > 8
  }

  // Отправляем специфичные события
  if (changes.targetChanged) {
    raise({ type: 'TARGET_CHANGED', })
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

  assign({
    previousCombatState: {
      enemyId: nearestEnemy.entity.id,
      distance: nearestEnemy.distance,
      health
    }
  })
}

export default {
  analyzeCombat,
}