import { GoalNear } from "../../../modules/plugins/goals.js"

const entryCombat = ({ context: { bot } }) => {
  console.log('⚔️ Вход в состояние COMBAT')

  bot.armorManager.equipAll() // Бот при наличии брони в инвенторе наденет её

  if (bot.movements) {
    bot.movements.allowSprinting = true // Разрешаем боту бежать        
  }
}

const entryDeciding = ({ context }) => {
  console.log('⚔️ Вход в состояние DECIDING')
}

const entryFleeing = ({ context, event }) => {
  console.log('🏃 Вход в состояние FLEEING - убегаю и лечусь!')
  const { bot, nearestEnemy, position } = context

  if (bot.movements) {
    bot.movements.allowSprinting = true // Спринт для быстрого убегания
  }

  // Убегаем от врага
  if (!nearestEnemy?.entity || !nearestEnemy.entity.isValid) return
  const enemy = nearestEnemy.entity
  const botPos = bot.entity.position
  const enemyPos = enemy.position
  const player = bot.utils.searchPlayer()

  // Начинаем есть для восстановления здоровья
  if (bot.utils.getAllFood().length > 0) {
    if (botPos.distanceTo(enemyPos) >= 15) {
      bot.utils.eating()
    } else {
      bot.chat('Не могу поесть враги рядом !')
      console.log('⚠️ Нет возможности поесть враги рядом')
    }
  } else {
    bot.chat('ААААА! Нет еды, за мной бегут !!!')
    console.log('⚠️ Нет еды для лечения!')
  }

  if (player && player.position.distanceTo(enemyPos) > 10 && player.position.distanceTo(botPos) <= 100) {
    console.log(`🏃‍♂️‍➡️ Бот бежит к игроку "${player.username}"`)
    bot.chat(`Бегу к ${player.username} выручай!`)
    bot.pathfinder.setGoal(new GoalNear(player.position.x, player.position.y, player.position.z, 3), true)
    return
  }

  // Вычисляем вектор направления от врага
  const direction = botPos.clone().subtract(enemyPos).normalize()

  // Точка на расстоянии 20 блоков от врага в противоположном направлении
  const fleeTarget = botPos.clone().add(direction.scaled(20))

  console.log(`🏃 Убегаю от ${enemy.name || enemy.displayName} в точку (${fleeTarget.x.toFixed(1)}, ${fleeTarget.y.toFixed(1)}, ${fleeTarget.z.toFixed(1)})`)

  // Двигаемся к безопасной точке
  bot.pathfinder.setGoal(new GoalNear(
    Math.floor(fleeTarget.x),
    Math.floor(fleeTarget.y),
    Math.floor(fleeTarget.z),
    1
  ), true)
}

const entryDefenging = ({ context, event }) => {
  console.log('⚔️ Вход в состояние DEFENDING')
}

const entryMeleeAttacking = ({ context: { bot, nearestEnemy }, event }) => {
  console.log('⚔️ Вход в состояние MELEE_ATTACKING')
  const { entity } = nearestEnemy

  if (!entity || !entity?.isValid) {
    console.log('⚔️ Нет валидного врага для атаки')
    return
  }

  const meleeWeapon = bot.utils.getMeleeWeapon() // поиск оружия меч/топор

  if (meleeWeapon) {
    console.log(`🗡️ Экипировал оружие: ${meleeWeapon.name}`)
    bot.equip(meleeWeapon, 'hand')
  } else {
    console.log('🗡️ Нет оружия ближнего боя❗')
  }

  console.log(`⚔️ Атакую ${entity.name || entity.displayName}`)
  bot.pvp.attack(entity)
}

const entryRangedAttacking = ({ context: { bot, nearestEnemy }, event }) => {
  console.log('⚔️ Вход в состояние RANGED_ATTACKING')
  const { entity } = nearestEnemy

  if (!entity || !entity?.isValid) {
    console.log('🏹 Нет валидного врага для стрельбы')
    return
  }

  console.log(`🏹 Начинаю дальний бой с ${entity.name || entity.displayName}`)

  const weapon = bot.utils.getRangeWeapon() // поиск оружия лук/арбалет
  const arrows = bot.utils.getArrow()

  if (weapon && arrows) {
    bot.equip(weapon, 'hand')
    console.log(`🏹 Экипировал: ${weapon.name}`)
    bot.hawkEye.autoAttack(entity, weapon.name)
  }
}

export default {
  entryCombat,
  entryDeciding,
  entryFleeing,
  entryDefenging,
  entryMeleeAttacking,
  entryRangedAttacking,
}