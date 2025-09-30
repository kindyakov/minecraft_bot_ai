export const context = {
  bot: null,
  // Жизненные показатели
  health: 20,
  food: 20,
  oxygen: 20,
  foodSaturation: 5,

  // Окружение
  weather: null,
  timeOfDay: null,
  entities: [],
  enemies: [],
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

  tasks: [],

  // Настройки поведения
  preferences: {
    autoEat: true,
    autoDefend: true,
    followDistance: 3, // Дистанция преследования за игроком
    maxDistToEnemy: 20, // Дистанция на которой бот атакует врагов
    maxObservDist: 50, // Дистаннция наблюдения за существами
    combatMode: 'defensive',

    healthCritical: 10,      // Входить в FLEEING
    healthRestored: 17,      // Выходить из FLEEING (> 8)

    enemyMeleeRange: 5,     // Дистанция для ближнего боя
    enemyRangedRange: 8,    // Дистанция для дальнего боя

    fleeToPlayerRadius: 50, // Радиус поиска игрока при побеге

    maxCountSlotsInInventory: 45, // Максимальное количество слотов в инвентаре

    foodEmergency: 6,       // Экстренное поедание
    foodFull: 20,           // Полный голод
    healthEmergency: 6,     // Экстренное лечение
    healthFull: 20,         // Полное здоровье
  },

  nearestEnemy: {
    entity: null,
    distance: Infinity,
  },
  prevCombatState: {
    enemyId: null,
    distance: Infinity,
    health: 20
  }
}