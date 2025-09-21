import { and } from 'xstate';
import { isHigherPriority } from '../utils/getPriority.js';

const isHungerCritical = and([
  ({ context, event, state }) => isHigherPriority(state, 'EMERGENCY_EATING'),
  ({ context, event }) => context.food < 5
])

const isHealthCritical = and([
  ({ context, event, state }) => isHigherPriority(state, 'EMERGENCY_HEALING'),
  ({ context, event }) => context.health < 5
])

const isEnemyNearby = and([
  ({ context, event, state }) => isHigherPriority(state, 'COMBAT'),
  ({ context, event }) => {
    const enemies = context.entities.filter(entity => entity.type === 'hostile');
    return enemies.some(enemy => enemy.position.distanceTo(context.position) <= context.preferences.maxDistToEnemy);
  }
])

const isInventoryFull = and([
  ({ context, event, state }) => isHigherPriority(state, 'DEPOSIT_ITEMS'),
  ({ context, event }) => context.inventory.length >= 45
])

const isBrokenArmorOrTools = and([
  ({ context, event, state }) => isHigherPriority(state, 'REPAIR_ARMOR_TOOLS'),
  ({ context, event }) =>
    Object.values({ ...context.toolDurability, ...context.armorDurability }).some(durability => durability <= 10)
])

const noEnemies = ({ context, event }) => context.entities
  .filter(entity => entity.type === 'hostile')
  .every(entity => entity.position.distanceTo(context.position) > context.preferences.maxDistToEnemy); // проверяем что все враги дальге 15 блокгов от бота

const isFoodRestored = (context, event) => context.food === 20
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
