import pathFinderPkg from 'mineflayer-pathfinder';
const { pathfinder, Movements } = pathFinderPkg;

export const loadPathfinder = (bot) => {
  bot.loadPlugin(pathfinder)
}

export const initPathfinder = (bot) => {
  const movements = new Movements(bot)
  bot.pathfinder.setMovements(movements)
}