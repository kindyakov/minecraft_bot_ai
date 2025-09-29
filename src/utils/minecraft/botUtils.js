export class BotUtils {
  constructor(bot) {
    this._bot = bot // приватная переменная
    this.lastMovingAt = Date.now()
    this._eatingTimeoutId = null // таймер для кушания

    this._shootTimeoutId = null // таймер для стрельбы
    this._shootAbortController = new AbortController()
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
    if (this._bot.pathfinder.isMoving()) {
      this.lastMovingAt = Date.now()
      this.lastPosition = this._bot.entity.position.clone()
      return false
    }

    // Если недавно двигался - не застрял
    if (Date.now() - this.lastMovingAt < timeout) return false

    // Проверка изменения позиции
    if (!this.lastPosition) {
      this.lastPosition = this._bot.entity.position.clone()
      return false
    }

    const moved = this._bot.entity.position.distanceTo(this.lastPosition)
    return moved < 0.5 // застрял если сдвинулся меньше чем на 0.5 блока
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
  getMeleeWeapon() {
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

  getRangeWeapon() {
    return this._bot.inventory.items().find(item =>
      item.name.includes('bow') || item.name.includes('crossbow')
    )
  }

  getArrow() {
    return this._bot.inventory.items().find(item => item.name.includes('arrow'))
  }

  searchPlayer(playerName = '') {
    return this._bot.nearestEntity(e => e.name === playerName || e.type === 'player')
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
    return this.getAllItems()
      .filter(item => this._bot.autoEat.foodsByName[item.name])
      .filter(item => !this._bot.autoEat.opts.bannedFood.includes(item.name))
  }

  // Для еды
  async eating() {
    if (!this._bot || this._bot?.health === 20) {
      this.stopEating()
      return
    }

    try {
      if (this._bot.food >= 20) {
        console.log('Голод полный, жду регенерации здоровья...')
        this.stopEating() // Очищаем предыдущий
        this._eatingTimeoutId = setTimeout(() => {
          this.eating()
        }, 1500)
        return
      }

      console.log('Ищу еду в инвентаре...')

      const allItems = this._bot.utils.getAllItems()
      const foodChoices = this._bot.autoEat.findBestChoices(allItems, 'saturation')

      if (!foodChoices.length) {
        this._bot.chat('Нет еды в инвентаре критическая ситуация!')
        return
      }

      const bestFood = foodChoices[0]
      console.log(`Выбрал еду: ${bestFood.name}`)

      await this._bot.equip(bestFood, 'hand')

      console.log('Начинаю есть...')
      await this._bot.consume()

      console.log(`Поел! HP: ${this._bot.health.toFixed(1)}, Food: ${this._bot.food}, Saturation: ${this._bot.foodSaturation.toFixed(1)}`)

      if (this._bot.health < 20) {
        this.stopEating()
        this._eatingTimeoutId = setTimeout(() => {
          this.eating()
        }, 1500)
      }
    } catch (error) {
      console.log(`Ошибка при еде: ${error.message}`)
      if (this._bot.health < 20) {
        this.stopEating()
        this._eatingTimeoutId = setTimeout(() => {
          this.eating()
        }, 1500)
      }
    }
  }

  stopEating() {
    if (this._eatingTimeoutId) {
      clearTimeout(this._eatingTimeoutId)
      this._eatingTimeoutId = null
    }
  }

  async shoot({ entity, weapon }) {
    try {
      if (this._shootAbortController.signal.aborted) {
        console.log('🏹 Стрельба отменена')
        return
      }

      if (!entity.isValid) {
        console.log('🏹 Цель больше не валидна')
        return
      }

      await this._bot.lookAt(entity.position, true) // Прицеливаемся

      if (this._shootAbortController.signal.aborted) return

      this._bot.activateItem() // Начинаем натягивать тетиву

      // Время натяжения (для лука ~1000ms, для арбалета зависит от чаров)
      const chargeTime = weapon.name.includes('crossbow') ? 1250 : 1000
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, chargeTime)

        // Слушаем сигнал отмены
        this._shootAbortController.signal.addEventListener('abort', () => {
          clearTimeout(timeout)
          this._bot.deactivateItem() // Прерываем натяжение
          reject(new Error('Shooting aborted'))
        })
      })

      if (this._shootAbortController.signal.aborted) return

      this._bot.deactivateItem() // Отпускаем = выстрел!
      console.log('🏹 Выстрелил!')

      this._shootTimeoutId = setTimeout(() => {
        this._shootTimeoutId = null
        if (!this._shootAbortController.signal.aborted) {
          this.shoot({ entity, weapon })
        }
      }, 500)
    } catch (error) {
      if (error.message === 'Shooting aborted') {
        console.log('🏹 Стрельба прервана')
      } else {
        console.log(`🏹 Ошибка стрельбы: ${error.message}`)
      }
    }
  }

  stopShoot() {
    console.log('🏹 Останавливаю стрельбу')

    this._shootAbortController.abort()

    if (this._shootTimeoutId) {
      clearTimeout(this._shootTimeoutId)
      this._shootTimeoutId = null
    }

    this._shootAbortController = new AbortController()
  }
}