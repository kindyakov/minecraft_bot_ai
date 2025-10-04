import { createStatefulService } from "./base/createStatefulService.js"
import { GoalXZ, GoalNear } from "../../modules/plugins/goals.js"

const serviceEmergencyHealing = createStatefulService({
  name: 'EmergencyHealing',
  tickInterval: 1000,

  initialState: {
    isEating: false,
    lastFleeTime: 0
  },

  onStart: ({ bot }) => {
    console.log('🚨 КРИТИЧЕСКОЕ ЗДОРОВЬЕ! Режим выживания')
    bot.chat('Мне плохо! Нужно срочно вылечиться!')

    if (bot.movements) {
      bot.movements.allowSprinting = true
    }
  },

  onTick: ({ bot, context, state, sendBack, setState }) => {
    const { health, preferences, position, enemies, nearestEnemy } = context

    // 1. Здоровье восстановлено - выходим
    if (health > preferences.healthFullyRestored) {
      console.log('💚 Здоровье восстановлено!')
      bot.utils.stopEating()
      sendBack({ type: 'HEALTH_RESTORED' })
      return
    }

    // 2. Нет врагов - можно лечиться на месте
    if (enemies.length === 0) {
      console.log('✅ Врагов нет, лечусь на месте')
      bot.pathfinder.setGoal(null)
      bot.utils.eating()
      setState({ isEating: true })
      return
    }

    const hasFood = bot.utils.getAllFood().length > 0

    if (!hasFood) {
      console.log('⚠️ НЕТ ЕДЫ! Просто убегаю')
      bot.chat('У меня нет еды! Помогите!')
    }

    // 3. Проверяем: можно ли убежать к игроку
    const player = bot.utils.searchPlayer()
    const canFleeToPlayer = player && (() => {
      const playerPos = player.position
      const playerToBotDist = playerPos.distanceTo(position)

      // Игрок слишком далеко
      if (playerToBotDist > preferences.fleeToPlayerRadius) {
        return false
      }

      // Проверяем что все враги далеко от игрока
      const allEnemiesFarFromPlayer = enemies.every(enemy => {
        const distToPlayer = enemy.position.distanceTo(playerPos)
        return distToPlayer > preferences.safePlayerDistance
      })

      return allEnemiesFarFromPlayer
    })()

    // 4. Враг ОЧЕНЬ близко - немедленно бежим
    if (nearestEnemy.distance < preferences.safeEatDistance) {
      console.log(`🏃 Враг БЛИЗКО (${nearestEnemy.distance.toFixed(1)}м)!`)

      bot.utils.stopEating()
      setState({ isEating: false })

      if (canFleeToPlayer) {
        console.log(`🏃‍♂️ Бегу к игроку "${player.username}"`)
        bot.chat(`${player.username}, спаси меня!`)
        bot.pathfinder.setGoal(new GoalNear(
          player.position.x,
          player.position.y,
          player.position.z,
          3
        ))
      } else {
        // Убегаем от ближайшего врага
        const enemyPos = nearestEnemy.entity.position
        const direction = position.clone().subtract(enemyPos).normalize()
        const fleeTarget = position.clone().add(direction.scaled(preferences.fleeTargetDistance))

        bot.pathfinder.setGoal(new GoalXZ(
          Math.floor(fleeTarget.x),
          Math.floor(fleeTarget.z),
        ))
      }

      setState({ lastFleeTime: Date.now() })
      return
    }

    // 5. Враги далеко - останавливаемся и лечимся
    console.log(`✅ Враги далеко (${nearestEnemy.distance.toFixed(1)}м), лечусь`)
    bot.pathfinder.setGoal(null)
    bot.utils.eating()
    setState({ isEating: true })
  },
})

export default {
  serviceEmergencyHealing
}