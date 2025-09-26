import { and, stateIn, not, } from 'xstate';
import { PRIORITIES } from '../config/priorities.js';

const STATE_PATHS = {
  // URGENT_NEEDS
  'EMERGENCY_HEALING': { MAIN_ACTIVITY: { URGENT_NEEDS: 'EMERGENCY_HEALING' } },
  'EMERGENCY_EATING': { MAIN_ACTIVITY: { URGENT_NEEDS: 'EMERGENCY_EATING' } },

  // PEACEFUL
  'FOLLOWING': { MAIN_ACTIVITY: { PEACEFUL: 'FOLLOWING' } },
  'MINING': { MAIN_ACTIVITY: { PEACEFUL: 'MINING' } },
  'BUILDING': { MAIN_ACTIVITY: { PEACEFUL: 'BUILDING' } },
  'FARMING': { MAIN_ACTIVITY: { PEACEFUL: 'FARMING' } },
  'SLEEPING': { MAIN_ACTIVITY: { PEACEFUL: 'SLEEPING' } },
  'SHELTERING': { MAIN_ACTIVITY: { PEACEFUL: 'SHELTERING' } },
  'IDLE': { MAIN_ACTIVITY: { PEACEFUL: 'IDLE' } },

  // COMBAT
  'COMBAT': { MAIN_ACTIVITY: 'COMBAT' },
  'FLEEING': { MAIN_ACTIVITY: { COMBAT: 'FLEEING' } },
  'MELEE_ATTACKING': { MAIN_ACTIVITY: { COMBAT: 'MELEE_ATTACKING' } },
  'RANGED_ATTACKING': { MAIN_ACTIVITY: { COMBAT: 'RANGED_ATTACKING' } },
  'DEFENDING': { MAIN_ACTIVITY: { COMBAT: 'DEFENDING' } },

  // TASKS
  'DEPOSIT_ITEMS': { MAIN_ACTIVITY: { TASKS: 'DEPOSIT_ITEMS' } },
  'REPAIR_ARMOR_TOOLS': { MAIN_ACTIVITY: { TASKS: 'REPAIR_ARMOR_TOOLS' } }
};

function getHigherPriorityConditions(currentPriority) {
  return Object.entries(PRIORITIES)
    .filter(([key, priority]) => priority > currentPriority)
    .filter(([key]) => STATE_PATHS[key]) // ✅ Только если путь известен
    .map(([key]) => not(stateIn(STATE_PATHS[key]))); // ✅ Используем правильный путь
}

const isHungerCritical = and([
  not(stateIn({ MAIN_ACTIVITY: { URGENT_NEEDS: 'EMERGENCY_EATING' } })),
  not(stateIn({ MAIN_ACTIVITY: { URGENT_NEEDS: 'EMERGENCY_HEALING' } })),
  ...getHigherPriorityConditions(PRIORITIES.EMERGENCY_EATING),
  ({ context, event }) => context.food < 5
])

const isHealthCritical = and([
  not(stateIn({ MAIN_ACTIVITY: { URGENT_NEEDS: 'EMERGENCY_HEALING' } })),
  not(stateIn({ MAIN_ACTIVITY: { URGENT_NEEDS: 'EMERGENCY_EATING' } })),
  ...getHigherPriorityConditions(PRIORITIES.EMERGENCY_HEALING),
  ({ context, event }) => context.health < 5,
])

const isEnemyNearby = and([
  not(stateIn({ MAIN_ACTIVITY: 'COMBAT' })),
  ...getHigherPriorityConditions(PRIORITIES.COMBAT),
  ({ context, event }) => {
    return context.enemies.some(enemy => enemy.position.distanceTo(context.position) <= context.preferences.maxDistToEnemy);
  }
])

const isInventoryFull = and([
  not(stateIn({ MAIN_ACTIVITY: { TASKS: 'DEPOSIT_ITEMS' } })),
  ...getHigherPriorityConditions(PRIORITIES.DEPOSIT_ITEMS),
  ({ context, event }) => context.inventory.length >= 45
])

const isBrokenArmorOrTools = and([
  not(stateIn({ MAIN_ACTIVITY: { TASKS: 'REPAIR_ARMOR_TOOLS' } })),
  ...getHigherPriorityConditions(PRIORITIES.REPAIR_ARMOR_TOOLS),
  ({ context, event }) =>
    Object.values({ ...context.toolDurability, ...context.armorDurability }).some(durability => durability <= 10)
])

const noEnemies = and([
  stateIn({ MAIN_ACTIVITY: 'COMBAT' }),
  ({ context }) => context.enemies
    .every(enemy => enemy.position.distanceTo(context.position) > context.preferences.maxDistToEnemy) // проверяем что все враги дальше 15 блоков от бота
])

const isFoodRestored = and([
  not(stateIn({ MAIN_ACTIVITY: { URGENT_NEEDS: 'EMERGENCY_EATING' } })),
  ({ context, event }) => context.food === 20
])

const isHealthRestored = and([
  not(stateIn({ MAIN_ACTIVITY: { URGENT_NEEDS: 'EMERGENCY_HEALING' } })),
  ({ context, event }) => {
    console.log(`Я наелся здоровье: ${context.bot.health}`)
    return context.health === 20
  }
])

const noTasks = and([
  stateIn({ MAIN_ACTIVITY: 'TASKS' }),
  ({ context }) => !context.tasks.length
])

export const guards = {
  isHungerCritical,
  isHealthCritical,
  isEnemyNearby,
  isInventoryFull,
  isBrokenArmorOrTools,
  noTasks,
  noEnemies,
  isFoodRestored,
  isHealthRestored,
}
