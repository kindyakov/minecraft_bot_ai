import { loader as autoEat } from 'mineflayer-auto-eat'

export const loadAutoEat = (bot) => {
  bot.loadPlugin(autoEat)
}

export const initAutoEat = (bot) => {
  // bot.autoEat.enableAuto()
  bot.autoEat.setOpts({
    eatingTimeout: 10000,
    strictErrors: false,  // Логирование вместо исключений
    equipOldItem: true,      // вернуть предмет после еды
    priority: 'saturation',   // бот выбирает еду, которая даёт максимальное насыщение
    offhand: false, // бот будет использовать вторую руку
  })
}