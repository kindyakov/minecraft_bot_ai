import { assign } from 'xstate';

const setBot = assign({
  bot: ({ context, event }) => event.bot
});

const updatePosition = assign({
  position: ({ context, event }) => event.position
})

const updateFoodSaturation = assign({
  foodSaturation: ({ context, event }) => event.foodSaturation
})

const updateAfterDeath = assign({
  entities: [],
  enemies: [],

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
  nearestEnemy: {
    entity: null,
    distance: Infinity,
  },
  prevCombatState: {
    enemyId: null,
    distance: Infinity,
    health: 20
  }
})

export default {
  setBot,
  updatePosition,
  updateFoodSaturation,
  updateAfterDeath,
}
