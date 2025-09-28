import { assign } from "xstate"
import { GoalFollow } from "../../../modules/plugins/goals.js";

const entryCombat = assign(({ context }) => {
  const bot = context.bot
  console.log('⚔️ Вход в состояние COMBAT')

  bot.armorManager.equipAll() // Бот при наличии брони в инвенторе наденет её

  if (bot.movements) {
    bot.movements.allowSprinting = true // Разрешаем боту бежать        
  }

  return {
    combatContextChanged: false,
    nearestEnemy: null,
  }
})

const entryDeciding = assign(({ context }) => {
  console.log('⚔️ Вход в состояние DECIDING')
  return {
    combatContextChanged: false
  }
})

const entryFleeing = ({ context, event }) => {
  console.log('⚔️ Вход в состояние FLEEING')

}

const entryDefenging = ({ context, event }) => {
  console.log('⚔️ Вход в состояние DEFENDING')
}

const entryMeleeAttacking = ({ context: { bot, nearestEnemy }, event }) => {
  console.log('⚔️ Вход в состояние MELEE_ATTACKING')
  const { entity = null } = nearestEnemy

  if (!entity || !entity?.isValid) {
    console.log('⚔️ Нет валидного врага для атаки')
    return
  }

  const weapon = bot.utils.searchWeapons() // поиск оружия меч/топор
  if (!weapon) {
    console.log('❌ Нет оружия!')
    return
  }

  console.log(`🗡️ Экипировал оружие: ${weapon.name}`)
  bot.equip(weapon, 'hand')

  console.log(`⚔️ Атакую ${entity.name || entity.displayName}`)
  bot.pvp.attack(entity)
}

const entryRangedAttacking = async ({ context: { bot, nearestEnemy }, event }) => {
  const { entity = null } = nearestEnemy

  if (!entity || !entity?.isValid) {
    console.log('🏹 Нет валидного врага для стрельбы')
    return
  }

  console.log(`🏹 Начинаю дальний бой с ${entity.name || entity.displayName}`)

  // 1. Ищем лук/арбалет
  const rangedWeapon = bot.inventory.items().find(item =>
    item.name.includes('bow') || item.name.includes('crossbow')
  )

  if (rangedWeapon) {
    bot.equip(rangedWeapon, 'hand')
    console.log(`🏹 Экипировал: ${rangedWeapon.name}`)

    try {
      await bot.lookAt(entity.position, true) // Прицеливаемся
      bot.activateItem() // Начинаем натягивать тетиву

      // Время натяжения (для лука ~1000ms, для арбалета зависит от чаров)
      const chargeTime = rangedWeapon.name.includes('crossbow') ? 1250 : 1000
      await new Promise(resolve => setTimeout(resolve, chargeTime))

      bot.deactivateItem() // Отпускаем = выстрел!
      console.log('🏹 Выстрелил!')
    } catch (error) {
      console.log(`🏹 Ошибка стрельбы: ${error.message}`)
    }
  } else {
    console.log('🏹 Нет дальнобойного оружия, переключаюсь на ближний бой')

    const weapon = bot.utils.searchWeapons()
    if (weapon) {
      bot.equip(weapon, 'hand')
      bot.pvp.attack(entity)
    }
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