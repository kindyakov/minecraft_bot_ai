import { loadPathfinder, initPathfinder } from "./pathfinder.js"
import { loadArmorManager, initArmorManager } from "./armorManager.js"
import { loadPvp } from "./pvp.js"
import { initViewer } from "./viewer.js"
import { loadWebInventory } from "./webInventory.js"
import { loadAutoEat, initAutoEat } from "./autoEat.js"
import { loadTool } from "./tool.js"
// import { loadDashboard } from "./dashboard.js"
import { loadHawkeye } from "./hawkeye.js"

export const loadPlugins = (bot) => {
  loadPathfinder(bot)
  loadArmorManager(bot)
  loadWebInventory(bot)
  loadAutoEat(bot)
  // loadDashboard(bot)
  // loadTool(bot) // походу не совместим
  loadPvp(bot)
  loadHawkeye(bot)
}

export const initPlugins = (bot) => {
  initPathfinder(bot)
  // initArmorManager(bot)
  // initViewer(bot)
  initAutoEat(bot)
}