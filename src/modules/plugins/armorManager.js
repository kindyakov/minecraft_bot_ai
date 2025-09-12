import armorManager from 'mineflayer-armor-manager'

export const loadArmorManager = (bot) => {
  bot.loadPlugin(armorManager)
}

export const initArmorManager = (bot) => {
  bot.armorManager.equipAll()
}