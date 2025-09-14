import { loadPathfinder, initPathfinder } from "./pathfinder.js"
import { loadArmorManager, initArmorManager } from "./armorManager.js"
import { loadPvp } from "./pvp.js"
import { initViewer } from "./viewer.js"
import { loadWebInventory } from "./webInventory.js"
import { loadAutoEat, initAutoEat } from "./autoEat.js"
import { loadTool } from "./tool.js"

export const loadPlugins = (bot) => {
  loadPathfinder(bot)
  loadArmorManager(bot)
  loadWebInventory(bot)
  loadAutoEat(bot)
  // loadTool(bot) // походу тоже ну совместим
  // loadPvp(bot) // не совместим с текущей версией mineflayer
}

export const initPlugins = (bot) => {
  initPathfinder(bot)
  initArmorManager(bot)
  initViewer(bot)
  // initAutoEat(bot)
}