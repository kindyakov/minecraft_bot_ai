import { raise } from "xstate"
import { GoalXZ, GoalFollow, GoalNear } from "../../../modules/plugins/goals.js"

const entryCombat = ({ context: { bot } }) => {
  try {
    console.log('⚔️ Вход в состояние COMBAT')

    bot.armorManager.equipAll() // Бот при наличии брони в инвенторе наденет её

    if (bot.movements) {
      bot.movements.allowSprinting = true // Разрешаем боту бежать        
    }

  } catch (error) {
    console.log('Ошибка при в ходе в COMBAT', error)
  }
}

const entryDeciding = ({ context }) => {
  console.log('🤔⚔️ Вход в состояние DECIDING')
}

const entryFleeing = ({ context, event }) => {
  console.log('🏃 Вход в состояние FLEEING - убегаю и лечусь!')
  const { bot, nearestEnemy, preferences } = context

  if (bot.movements) {
    bot.movements.allowSprinting = true
  }

  const botPos = bot.entity.position
  const player = bot.utils.searchPlayer()
  const hasFood = bot.utils.getAllFood().length > 0

  // Проверка: можно ли убежать к игроку
  const canFleeToPlayer = (enemy) => {
    if (!player) return false

    const playerToEnemyDist = player.position.distanceTo(enemy.position)
    const playerToBotDist = player.position.distanceTo(botPos)

    return playerToEnemyDist > preferences.safePlayerDistance
      && playerToBotDist <= preferences.fleeToPlayerRadius
  }

  // Убегание от врага
  const fleeFromEnemy = (enemy) => {
    const enemyPos = enemy.position
    const direction = botPos.clone().subtract(enemyPos).normalize()
    const fleeTarget = botPos.clone().add(direction.scaled(preferences.fleeTargetDistance))

    console.log(`🏃 Убегаю от ${enemy.name || enemy.displayName} в точку (${fleeTarget.x.toFixed(1)}, ${fleeTarget.y.toFixed(1)}, ${fleeTarget.z.toFixed(1)})`)

    bot.pathfinder.setGoal(new GoalXZ(
      Math.floor(fleeTarget.x),
      Math.floor(fleeTarget.z),
    ))
  }

  // Убегание к игроку
  const fleeToPlayer = () => {
    console.log(`🏃‍♂️‍➡️ Бот бежит к игроку "${player.username}"`)
    bot.chat(`Бегу к ${player.username}, выручай!`)
    bot.pathfinder.setGoal(new GoalNear(
      player.position.x,
      player.position.y,
      player.position.z,
      3
    ))
  }

  // Нет еды - всё равно убегаем
  if (!hasFood) {
    bot.chat('ААААА! Нет еды, за мной бегут !!!')
    console.log('⚠️ Нет еды для лечения!')

    if (nearestEnemy?.entity?.isValid) {
      fleeFromEnemy(nearestEnemy.entity)
    }
    return
  }

  // Есть еда - решаем есть или убегать
  if (nearestEnemy?.entity?.isValid) {
    const enemy = nearestEnemy.entity
    const distanceToEnemy = botPos.distanceTo(enemy.position)

    // Враг близко - убегаем
    if (distanceToEnemy < preferences.safeEatDistance) {
      bot.chat('Не могу поесть, враги рядом!')
      console.log('⚠️ Нет возможности поесть, враги рядом')

      // Проверяем можно ли убежать к игроку
      if (canFleeToPlayer(enemy)) {
        fleeToPlayer()
        return
      }

      // Иначе убегаем от врага
      fleeFromEnemy(enemy)
      return
    }
  }

  // Враг далеко или его нет - едим
  console.log('✅ Безопасно! Останавливаюсь и ем')
  bot.pathfinder.setGoal(null)
  bot.utils.eating()
}

const entryDefenging = ({ context, event }) => {
  console.log('⚔️ Вход в состояние DEFENDING')
}

const entryMeleeAttacking = raise(({ context: { bot, nearestEnemy }, event }) => {
  console.log('⚔️ Вход в состояние MELEE_ATTACKING')

  if (!nearestEnemy?.entity?.isValid) {  // Проверяем СНАЧАЛА
    console.log('⚔️ Нет валидного врага для атаки')
    return { type: 'NO_ENEMIES' }
  }

  const { entity } = nearestEnemy

  const meleeWeapon = bot.utils.getMeleeWeapon() // поиск оружия меч/топор
  if (meleeWeapon) {
    console.log(`🗡️ Экипировал оружие: ${meleeWeapon.name}`)
    bot.equip(meleeWeapon, 'hand')
  } else {
    console.log('🗡️ Нет оружия ближнего боя❗')
  }

  console.log(`⚔️ Атакую ${entity.name || entity.displayName}`)

  bot.pvp.attack(entity)

  return {}
})

const entryRangedAttacking = raise(({ context: { bot, nearestEnemy }, event }) => {
  console.log('⚔️ Вход в состояние RANGED_ATTACKING')
  if (!nearestEnemy?.entity?.isValid) {  // Проверяем СНАЧАЛА
    console.log('⚔️ Нет валидного врага для атаки')
    return { type: 'NO_ENEMIES' }
  }

  const { entity } = nearestEnemy

  console.log(`🏹 Начинаю дальний бой с ${entity.name || entity.displayName}`)

  const weapon = bot.utils.getRangeWeapon() // поиск оружия лук/арбалет
  const arrows = bot.utils.getArrow()

  if (weapon && arrows) {
    bot.equip(weapon, 'hand')
    console.log(`🏹 Экипировал: ${weapon.name}`)
    bot.hawkEye.autoAttack(entity, weapon.name)
  } else {
    return { type: 'ENEMY_BECAME_CLOSE' }
  }

  return {}
})

export default {
  entryCombat,
  entryDeciding,
  entryFleeing,
  entryDefenging,
  entryMeleeAttacking,
  entryRangedAttacking,
}