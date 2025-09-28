import Logger from "../../config/logger.js"
import { loadPlugins, initPlugins } from "../plugins/index.plugins.js"

export const initConnection = (bot) => {
  loadPlugins(bot)

  bot.once("spawn", () => {
    initPlugins(bot)
    Logger.info("Бот заспавнился")
    bot.emit('botReady')
  })

  bot.on("end", (reason) => {
    Logger.warn(`Бот отключился: ${reason}`)
    bot.emit('botDisconnected', reason)
  })

  bot.on("error", (err) => {
    Logger.error("Ошибка бота:", err)
    bot.emit('botError', err)
  })

  // bot.on('diggingCompleted', (block) => console.log('initConnection: diggingCompleted', block && block.name))
  // bot.on('path_update', (r) => console.log('initConnection: path update:', r && r.status))
  // bot.on('path_reset', (reason) => console.log('initConnection: path reset:', reason))
}