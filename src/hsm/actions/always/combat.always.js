import { assign, raise } from "xstate"
import { findNearbyEnemies } from "../../utils/findNearbyEnemies.js"

const analyzeCombat = ({ context }) => {
  const { health, position, previousCombatState } = context
  const currentEnemy = findNearbyEnemies(context)

  if (!currentEnemy) {
    raise({ type: 'NO_ENEMIES' })
    return {}
  }

  const currentDistance = currentEnemy.position.distanceTo(position)

  // Определяем тип изменения
  const changes = {
    targetChanged: currentEnemy.id !== previousCombatState.enemyId,
    becameFar: previousCombatState.distance <= 5 && currentDistance > 8,
    becameClose: previousCombatState.distance > 8 && currentDistance <= 5,
    healthCritical: previousCombatState.health > 8 && health <= 8,
    healthRestored: previousCombatState.health <= 8 && health > 8
  }

  // Отправляем специфичные события
  if (changes.targetChanged) {
    raise({
      type: 'TARGET_CHANGED',
      enemy: currentEnemy,
      distance: currentDistance
    })
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

  // Всегда обновляем контекст
  raise({
    type: 'UPDATE_COMBAT_CONTEXT',
    enemy: currentEnemy,
    distance: currentDistance
  })
}

export default {
  analyzeCombat,
}