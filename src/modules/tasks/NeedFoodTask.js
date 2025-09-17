import { BaseTask } from './BaseTask.js'
import { TASK_TYPES } from './index.tasks.js'
import { GoalBlock, GoalNear } from '../plugins/goals.js'

export class NeedFoodTask extends BaseTask {
  constructor(fsm, data) {
    super(TASK_TYPES.NEED_FOOD, data)
    this.fsm = fsm
    this._maxDistance = 50
    this._maxFood = 30
  }

  canExecute(bot) {
    // Проверяем что бот не ест уже и действительно нужна еда
    return !bot.autoEat.isEating && bot.utils.needsToEat().shouldEat
  }

  async execute(bot) {
    this.isRunning = true

    try {
      this.progress = { stage: 'executing', completion: 0 }
      console.log('NeedFoodTask: 🔍 Ищу еду в сундуках...')

      // 1. Поиск сундуков с едой
      if (await this.searchChests(bot)) return this.completed()

      this.progress.completion = 25
      console.log('NeedFoodTask:🌾 Ищу урожай для сбора...')

      // 2. Поиск и сбор урожая
      if (await this.searchCrops(bot)) return this.completed()

      // this.progress.completion = 50
      // console.log('NeedFoodTask: 🐄 Ищу животных для охоты...')

      // 3. Охота на животных
      // if (await this.huntAnimals(bot)) return this.completed()

      this.progress = { stage: 'failed', completion: 100 }
      console.log('NeedFoodTask: ❌ Не удалось найти еду!')

      // 4. Критическая ситуация
      this.notifyPlayer(bot)

    } catch (error) {
      console.error('Ошибка при поиске еды:', error)
      this.notifyPlayer(bot)
    }
  }

  async searchChests(bot) {
    if (this.abortController.signal.aborted) return false

    await bot.waitForChunksToLoad() // Загрузка чанков

    // Ищем сундуки в радиусе 30 блоков
    const chests = bot.findBlocks({
      matching: block => ['chest', 'ender_chest', 'barrel'].includes(block.name),
      maxDistance: this._maxDistance,
      count: 5
    })

    for (const chestPos of chests) {
      if (this.abortController.signal.aborted) return false

      try {
        console.log(`NeedFoodTask: Иду к сундуку x:${chestPos.x}, y:${chestPos.y}, z:${chestPos.z}`);
        // Подходим к сундуку
        await bot.pathfinder.goto(new GoalNear(chestPos.x, chestPos.y, chestPos.z, 2))
        console.log(`NeedFoodTask: Дошел до сундука`)

        // Открываем сундук
        const chestBlock = bot.blockAt(chestPos)
        const chest = await bot.openChest(chestBlock)

        // Ищем еду в сундуке
        const foodItems = chest.slots
          .filter(item => item)
          .filter(item => bot.autoEat.foodsByName[item.name]) // Фильтрация еды
          .filter(item => !bot.autoEat.opts.bannedFood.includes(item.name)) // Фильтрация не съедобной еды

        if (foodItems.length > 0) {
          // Сортируем еду по питательности (лучшая еда первой)
          const bestFoods = foodItems.sort((a, b) =>
            bot.autoEat.foodsByName[b.name].foodPoints - bot.autoEat.foodsByName[a.name].foodPoints
          )

          let totalTaken = 0
          const takenItems = []

          // Берем еду из каждого слота пока не наберем 20 штук
          for (const food of bestFoods) {
            if (totalTaken >= this._maxFood) break

            const takeCount = Math.min(food.count, this._maxFood - totalTaken)
            await chest.withdraw(food.type, null, takeCount)

            totalTaken += takeCount
            takenItems.push(`${takeCount} ${food.displayName}`)

            console.log(`NeedFoodTask: взял ${takeCount} ${food.displayName}`)
          }

          chest.close()

          bot.chat(`Взял еды: ${takenItems.join(', ')} (всего: ${totalTaken})`)
          return true
        }

        chest.close()
      } catch (error) {
        console.log('Ошибка при работе с сундуком:', error.message)
        continue
      }
    }

    return false
  }

  async searchCrops(bot) {
    if (this.abortController.signal.aborted) return false

    // Настройка движений
    if (bot.movements) {
      bot.movements.allowParkour = false
      bot.movements.allow1by1towers = false
    }

    const crops = bot.findBlocks({
      matching: (block) => ['carrots', 'potatoes', 'beetroots'].includes(block.name) && block.metadata === 7,
      maxDistance: this._maxDistance,
      count: 10
    })

    const initialFood = bot.inventory.items()
      .filter(item => bot.autoEat.foodsByName[item.name])
      .reduce((sum, item) => sum + item.count, 0)

    for (const cropPos of crops) {
      if (this.abortController.signal.aborted) return false

      // Проверяем текущее количество еды
      const currentFood = bot.inventory.items()
        .filter(item => bot.autoEat.foodsByName[item.name])
        .reduce((sum, item) => sum + item.count, 0)

      if (currentFood >= this._maxFood) {
        console.log(`NeedFoodTask: Набрал еды: ${currentFood} штук!`)
        return true
      }

      try {
        await bot.pathfinder.goto(new GoalNear(cropPos.x, cropPos.y, cropPos.z, 1))

        const cropBlock = bot.blockAt(cropPos)
        await bot.dig(cropBlock)
        await new Promise(resolve => setTimeout(resolve, 500))

        // Ищем дроп и подбираем
        const drop = bot.nearestEntity(e => e.type === 'object' &&
          bot.entity.position.distanceTo(e.position) < 3)
        if (drop) {
          await bot.pathfinder.goto(new GoalNear(drop.position.x, drop.position.y, drop.position.z, 1))
          await new Promise(resolve => setTimeout(resolve, 300))
        }

      } catch (error) {
        console.log(`NeedFoodTask: Не могу добраться до урожая: ${error.message}`)
        continue // просто пропускаем недоступные блоки
      }
    }

    // Проверяем получили ли реально еду
    const finalFood = bot.inventory.items()
      .filter(item => bot.autoEat.foodsByName[item.name])
      .reduce((sum, item) => sum + item.count, 0)

    const gainedFood = finalFood - initialFood

    if (gainedFood > 0) {
      console.log(`NeedFoodTask: Собрал ${gainedFood} еды! Всего: ${finalFood}`)
      return true
    }

    console.log(`NeedFoodTask: Урожай недоступен`)
    return false
  }

  async huntAnimals(bot) {
    if (this.abortController.signal.aborted) return false

    // Ищем мирных животных для охоты
    const animals = ['cow', 'pig', 'chicken', 'sheep', 'rabbit']

    for (const animalType of animals) {
      const animal = bot.nearestEntity(entity =>
        entity.name?.toLowerCase() === animalType &&
        bot.entity.position.distanceTo(entity.position) < this._maxDistance
      )

      if (animal) {
        try {
          // Подходим к животному
          await bot.pathfinder.goto(new GoalNear(animal.position.x, animal.position.y, animal.position.z, 2))

          // Атакуем животное
          bot.attack(animal)

          // Ждем смерти животного
          await new Promise((resolve) => {
            const checkDeath = () => {
              if (!animal.isValid || animal.health <= 0) {
                resolve()
              } else {
                setTimeout(checkDeath, 100)
              }
            }
            checkDeath()
          })

          bot.chat(`Охота завершена: ${animal.displayName}!`)
          return true

        } catch (error) {
          console.log('Ошибка при охоте:', error.message)
          continue
        }
      }
    }

    return false
  }

  notifyPlayer(bot) {
    const health = bot.health

    if (health <= 5) {
      bot.chat('КРИТИЧНО! Я умираю от голода! Нужна срочная помощь!')
    } else if (health <= 10) {
      bot.chat('Очень голоден! Не могу найти еду поблизости!')
    } else {
      bot.chat('Не могу найти еду. Можете помочь?')
    }

    this.fsm.emit('task-failed', this.type)
  }

  completed() {
    this.isRunning = false
    this.progress = { stage: 'completed', completion: 100 }
    console.log('NeedFoodTask: ✅ Задача поиска еды выполнена!')

    // Уведомляем FSM о завершении
    this.fsm.emit('task-completed', this.type)
  }

  stop() {
    super.stop()
    console.log('⏹️ Поиск еды прерван')
  }
}