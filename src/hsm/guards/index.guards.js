import { and, stateIn, not, } from 'xstate';
import { isHigherPriority } from '../utils/getPriority.js';

const isHungerCritical = and([
  not(stateIn('EMERGENCY_EATING')),
  ({ context, event }) => isHigherPriority(state, 'EMERGENCY_EATING'),
  ({ context, event }) => context.food < 5
])

const isHealthCritical = and([
  not(stateIn('EMERGENCY_HEALING')),
  // ({ context, event }) => isHigherPriority(state, 'EMERGENCY_HEALING'),
  ({ context, event }) => context.health < 5
])

const isEnemyNearby = and([
  ({ context, event }) => isHigherPriority('ENTITIES_MONITOR', 'COMBAT'),
  ({ context, event }) => {
    const enemies = context.entities.filter(entity => entity.type === 'hostile');
    return enemies.some(enemy => enemy.position.distanceTo(context.position) <= context.preferences.maxDistToEnemy);
  }
])

const isInventoryFull = and([
  not(stateIn('DEPOSIT_ITEMS')),
  ({ context, event }) => isHigherPriority('INVENTORY_MONITOR', 'DEPOSIT_ITEMS'),
  ({ context, event }) => context.inventory.length >= 45
])

const isBrokenArmorOrTools = and([
  not(stateIn('REPAIR_ARMOR_TOOLS')),
  ({ context, event }) => isHigherPriority('ARMOR_TOOLS_MONITOR', 'REPAIR_ARMOR_TOOLS'),
  ({ context, event }) =>
    Object.values({ ...context.toolDurability, ...context.armorDurability }).some(durability => durability <= 10)
])

const noEnemies = ({ context, event }) => context.entities
  .filter(entity => entity.type === 'hostile')
  .every(entity => entity.position.distanceTo(context.position) > context.preferences.maxDistToEnemy); // проверяем что все враги дальге 15 блокгов от бота

const isFoodRestored = ({ context, event }) => context.food === 20
const isHealthRestored = ({ context, event }) => context.health === 20

export const guards = {
  isHungerCritical,
  isHealthCritical,
  isEnemyNearby,
  isInventoryFull,
  isBrokenArmorOrTools,
  noEnemies,
  isFoodRestored,
  isHealthRestored,
}
