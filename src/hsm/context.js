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
    axe: null,
    shield: null,
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

    // FLEEING distances
    safeEatDistance: 30,        // Минимальная дистанция до врага для безопасного поедания
    fleeTargetDistance: 20,     // Дистанция убегания от врага
    safePlayerDistance: 10,     // Минимальная дистанция от игрока до врага для безопасности (необходима для безопасности: когда бот бежит к игноку в состоянии FLEEING мог отбегать от игрока если с ним не безопасно)
    fleeToPlayerRadius: 50,     // Радиус поиска игрока при побеге (в FLEEING)

    healthCritical: 10,      // Входить в FLEEING
    healthRestored: 15,      // Выходить из FLEEING

    enemyMeleeRange: 5,     // Дистанция для ближнего боя
    enemyRangedRange: 8,    // Дистанция для дальнего боя


    maxCountSlotsInInventory: 45, // Максимальное количество слотов в инвентаре

    // Пороги для EMERGENCY_EATING
    foodEmergency: 6,        // Вход в EMERGENCY_EATING
    foodRestored: 20,        // Выход из EMERGENCY_EATING (полный голод)

    // Пороги для EMERGENCY_HEALING  
    healthEmergency: 6,      // Вход в EMERGENCY_HEALING
    healthFullyRestored: 18, // Выход из EMERGENCY_HEALING (почти полное HP)
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