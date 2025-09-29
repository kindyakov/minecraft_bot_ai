import { assign } from "xstate"

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
  console.log('⚔️ Вход в состояние FLEEING')
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
  if (!meleeWeapon) {
    console.log('❌ Нет оружия!')
    return
  }

  console.log(`🗡️ Экипировал оружие: ${meleeWeapon.name}`)
  bot.equip(meleeWeapon, 'hand')

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
    bot.utils.shoot({ entity, weapon })
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