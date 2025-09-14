import { loader as autoEat } from 'mineflayer-auto-eat'

export const loadAutoEat = (bot) => {
  bot.loadPlugin(autoEat)
}

export const initAutoEat = (bot) => {
  bot.autoEat.enableAuto()
}