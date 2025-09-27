import { assign } from "xstate"
import { GoalFollow } from "../../../modules/plugins/goals.js";

const entryCombat = assign({
  combatContextChanged: false,
  nearestEnemy: null
})

const entryDeciding = assign({
  combatContextChanged: false
})

const entryMeleeAttacking = ({ context: { bot }, event }) => {
  const weapon = bot.utils.searchWeapons() // поиск оружия меч/топор
  if (weapon) {
    bot.equip(weapon, 'hand')
  }

  bot.armorManager.equipAll() // Бот при наличии брони в инвенторе наденет её

  if (bot.movements) {
    bot.movements.allowSprinting = true // Разрешаем боту бежать        
  }
}

const entryRangedAttacking = ({ context, event }) => { }

export default {
  entryCombat,
  entryDeciding,
  entryMeleeAttacking,
  entryRangedAttacking,
}