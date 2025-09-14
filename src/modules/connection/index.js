import Logger from "../../config/logger.js"
import { CommandHandler } from "../commands/CommandHandler.js"
import { loadPlugins } from "../plugins/index.js"
import { initPlugins } from "../plugins/index.js"
import { BotUtils } from "../../utils/minecraft/botUtils.js"

export const initConnection = (bot) => {
  loadPlugins(bot)

  bot.once("spawn", () => {
    bot.utils = new BotUtils(bot)
    initPlugins(bot)
    new CommandHandler(bot)
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