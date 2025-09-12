import pathFinderPkg from 'mineflayer-pathfinder';
const { pathfinder, Movements } = pathFinderPkg;

export const loadPathfinder = (bot) => {
  bot.loadPlugin(pathfinder)
}

export const initPathfinder = (bot) => {
  const movements = new Movements(bot)
  movements.canDig = false // Запрещаем ломать блоки
  bot.pathfinder.setMovements(movements)
  bot.movements = movements
}