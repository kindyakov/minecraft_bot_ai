import { loadPathfinder, initPathfinder } from "./pathfinder.js"
import { loadArmorManager, initArmorManager } from "./armorManager.js"
import { loadPvp } from "./pvp.js"
import { initViewer } from "./viewer.js"

export const loadPlugins = (bot) => {
  loadPathfinder(bot)
  loadArmorManager(bot)
  // loadPvp(bot)
}

export const initPlugins = (bot) => {
  initPathfinder(bot)
  initArmorManager(bot)
  // initViewer(bot)
}