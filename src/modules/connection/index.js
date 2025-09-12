import Logger from "../../core/logger.js"
import { CommandHandler } from "../command_handler/index.js"
import { initPlugins } from "../plugins/index.js"

export const initConnection = (bot) => {

  bot.once("spawn", () => {
    initPlugins(bot)

    const commandHandler = new CommandHandler(bot)
    commandHandler.init()

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
}