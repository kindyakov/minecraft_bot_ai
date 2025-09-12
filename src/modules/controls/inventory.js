export const searchWeapons = (bot) => {
  if (!bot) return
  const weaponItems = [
    'netherite_sword', // незеритовый меч
    'netherite_axe',   // незеритовый топор
    'diamond_sword',   // алмазный меч
    'diamond_axe',     // алмазный топор
    'iron_sword',      // железный меч
    'iron_axe',        // железный топор
    'golden_sword',    // золотой меч
    'golden_axe',      // золотой топор
    'stone_sword',     // каменный меч
    'stone_axe',       // каменный топор
    'wooden_sword',    // деревянный меч
    'wooden_axe',      // деревянный топор
  ]
  let weapon = null

  for (const name of weaponItems) {
    weapon = bot.inventory.items().find(item => item.name === name)
    if (weapon) {
      break
    }
  }

  return weapon
}