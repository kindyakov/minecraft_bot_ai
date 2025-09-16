export class BotUtils {
  constructor(bot) {
    this._bot = bot // приватная переменная
    this.lastMovingAt = Date.now()
  }

  /**
 * Поиск ближайшего враждебного моба
 * @param {number} maxDistance - максимальная дистанция поиска
 * @returns {Object|null} враждебный моб или null
 */
  findNearestEnemy(maxDistance = 15, filter = null) {
    const baseFilter = (entity) => {
      if (!entity || entity.type !== 'hostile') return false

      const botY = this._bot.entity.position.y
      const entityY = entity.position.y
      const yDiff = Math.abs(botY - entityY)

      // Сначала проверяем высоту (быстрее), потом общую дистанцию
      return yDiff <= 8 &&
        this._bot.entity.position.distanceTo(entity.position) <= maxDistance
    }

    const combined = typeof filter === 'function'
      ? (e) => baseFilter(e) && filter(e)
      : baseFilter

    return this._bot.nearestEntity(combined)
  }

  /**
 * Проверка заполненности инвентаря
 * @param {number} threshold - порог заполненности (по умолчанию полный)
 * @returns {boolean} true если инвентарь заполнен
 */
  isInventoryFull(threshold = 36) {
    return this._bot.inventory.items().length >= threshold
  }

  /**
 * Проверка необходимости еды
 * @param {number} threshold - порог голода
 * @returns {boolean} true если нужно есть
 */
  needsFood(threshold = 17) {
    return this._bot.food <= threshold
  }

  /**
 * Проверка необходимости лечения
 * @param {number} health - порог здоровья
 * @returns {boolean} true если нужно лечение
 */
  needsHealing(health = 15) {
    return this._bot.health <= health
  }

  /**
 * Проверка необходимости лечения
 * @param {number} saturation - порог сытости
 * @returns {boolean} true если нужно есть
 */
  needsSaturation(saturation = 1) {
    return this._bot.foodSaturation < saturation
  }

  /**
 * Проверка на застревание
 * @param {number} timeout - таймаут застревания
 * @returns {boolean} true если застревание обнаружено
 */
  isStuck(timeout = 3000) {
    return !this._bot.pathfinder.isMoving() && Date.now() - this.lastMovingAt > timeout
  }

  /**
 * Комплексная проверка необходимости питания
 * @param {Object} thresholds - пороги для проверки
 * @returns {Object} объект с детальной информацией о необходимости питания
 */
  needsToEat(thresholds = { food: 17, health: 15, saturation: 5 }) {
    const currentFood = this._bot.food
    const currentHealth = this._bot.health
    const currentSaturation = this._bot.foodSaturation

    const result = {
      shouldEat: false,
      reasons: [],
      priority: 'none', // 'low', 'medium', 'high', 'critical'
      stats: {
        food: currentFood,
        health: currentHealth,
        saturation: currentSaturation
      }
    }

    // Критическое состояние - здоровье очень низкое
    if (currentHealth <= 6) {
      result.shouldEat = true
      result.priority = 'critical'
      result.reasons.push('критическое здоровье')
      return result
    }

    // Высокий приоритет - низкое здоровье + низкое насыщение
    if (currentHealth <= thresholds.health && currentSaturation < thresholds.saturation) {
      result.shouldEat = true
      result.priority = 'high'
      result.reasons.push('низкое здоровье и насыщение')
      return result
    }

    // Средний приоритет - просто голод
    if (currentFood <= thresholds.food) {
      result.shouldEat = true
      result.priority = 'medium'
      result.reasons.push('голод')
      return result
    }

    // Низкий приоритет - только насыщение
    if (currentSaturation < thresholds.saturation) {
      result.shouldEat = true
      result.priority = 'low'
      result.reasons.push('низкое насыщение')
    }

    return result
  }

  /**
 * Поиск оружия в инвентаре
 * @returns {Object|null} оружие или null
 */
  searchWeapons() {
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
      weapon = this._bot.inventory.items().find(item => item.name === name)
      if (weapon) {
        break
      }
    }

    return weapon
  }

  searchNearestPlayer() {
    return this._bot.nearestEntity(e => e.type === 'player')
  }

  getAllItems() {
    const items = this._bot.inventory.items()

    // Добавляем предмет из offhand если он существует
    const offhandItem = this._bot.inventory.slots[45]
    if (this._bot.registry.isNewerOrEqualTo('1.9') && offhandItem) {
      items.push(offhandItem)
    }

    return items
  }

  // Функция для поиска еды включая offhand
  getAllFood() {
    return this._bot.inventory.items()
      .filter(item => this._bot.autoEat.foodsByName[item.name])
      .filter(item => !this._bot.autoEat.opts.bannedFood.includes(item.name))
  }
}