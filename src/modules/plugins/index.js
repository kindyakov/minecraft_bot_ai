import { loadPathfinder, initPathfinder } from "./pathfinder.js"
import { loadArmorManager, initArmorManager } from "./armorManager.js"
import { loadPvp } from "./pvp.js"
import { initViewer } from "./viewer.js"
import { loadWebInventory } from "./webInventory.js"

export const loadPlugins = (bot) => {
  loadPathfinder(bot)
  loadArmorManager(bot)
  loadWebInventory(bot)
  // loadPvp(bot)
}

export const initPlugins = (bot) => {
  initPathfinder(bot)
  initArmorManager(bot)
  // initViewer(bot)
}