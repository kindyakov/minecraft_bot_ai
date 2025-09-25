export const context = {
  bot: null,
  // Жизненные показатели
  health: 20,
  food: 20,
  oxygen: 20,

  // Окружение
  weather: null,
  timeOfDay: null,
  entities: [],
  players: [],

  // Инвентарь и экипировка
  inventory: [],
  toolDurability: {
    pickaxe: null,
    sword: null,
    axe: 0,
    shield: 0,
  },
  armorDurability: {
    helmet: null,
    chestplate: null,
    leggings: null,
    boots: null,
  },

  // Позиция и навигация
  position: null,
  spawn: null,
  home: null,

  // Настройки поведения
  preferences: {
    autoEat: true,
    autoDefend: true,
    followDistance: 3,
    maxDistToEnemy: 15,
    combatMode: 'defensive'
  }
}