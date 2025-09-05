import minecraftData from "minecraft-data"
import pathFinderPkg from 'mineflayer-pathfinder';
import { mineflayer as mineFlayerViewer } from 'prismarine-viewer';

import Logger from "../../core/logger.js"
import Config from "../../core/config.js"

const { pathfinder, Movements, goals } = pathFinderPkg;

export const initConnection = ({ bot, start }) => {
  const mcData = minecraftData(Config.minecraft.version);

  bot.loadPlugin(pathfinder)


  bot.once("spawn", () => {
    Logger.info("Бот заспавнился")
    const movements = new Movements(bot, mcData)
    bot.pathfinder.setMovements(movements)
    mineFlayerViewer(bot, { port: 3000 })
  })

  bot.on("end", (reason) => {
    Logger.warn(`Бот отключился: ${reason}`)
  })

  bot.on("error", (err) => {
    Logger.error("Ошибка бота:", err)
  })
} 