import { fromCallback } from 'xstate'

/**
 * Универсальный factory для создания stateful service
 * Поддерживает: sync, async, events, гибридный подход
 */
export function createStatefulService(config) {
  return fromCallback(({ sendBack, input, receive }) => {
    const { context } = input
    const { bot } = context

    // Внутреннее состояние service
    let internalState = {
      ...config.initialState,
      isActive: true
    }

    // AbortController для отмены async операций
    const abortController = new AbortController()

    // Helper для обновления состояния
    const setState = (updates) => {
      if (typeof updates === 'function') {
        internalState = { ...internalState, ...updates(internalState) }
      } else {
        internalState = { ...internalState, ...updates }
      }
    }

    // Helper для получения актуального контекста
    const getContext = () => bot.hsm.getContext()

    // API для callbacks
    const api = {
      context: getContext(),
      state: internalState,
      bot,
      sendBack,
      setState,
      getContext,
      abortSignal: abortController.signal
    }

    // ========================================
    // 1. Инициализация (если задана)
    // ========================================
    if (config.onStart) {
      try {
        api.context = getContext()
        config.onStart(api)
      } catch (error) {
        console.error(`❌ Error in ${config.name} onStart:`, error)
      }
    }

    // ========================================
    // 2. Синхронный tick (если задан)
    // ========================================
    let tickInterval = null

    if (config.onTick) {
      const tick = () => {
        if (!internalState.isActive) return

        try {
          // Обновляем api с актуальным контекстом
          api.context = getContext()
          api.state = internalState

          config.onTick(api)
        } catch (error) {
          console.error(`❌ Error in ${config.name} onTick:`, error)
          sendBack({ type: 'ERROR', error: error.message })
        }
      }

      tickInterval = setInterval(tick, config.tickInterval || 1000)
    }

    // ========================================
    // 3. Асинхронный tick (если задан)
    // ========================================
    let asyncTickInterval = null
    let isAsyncRunning = false

    if (config.onAsyncTick) {
      const asyncTick = async () => {
        if (!internalState.isActive || isAsyncRunning) return

        isAsyncRunning = true

        try {
          api.context = getContext()
          api.state = internalState

          await config.onAsyncTick(api)
        } catch (error) {
          if (error.name === 'AbortError') {
            console.log(`⚠️ ${config.name}: async операция отменена`)
          } else {
            console.error(`❌ Error in ${config.name} onAsyncTick:`, error)
            sendBack({ type: 'ERROR', error: error.message })
          }
        } finally {
          isAsyncRunning = false
        }
      }

      asyncTickInterval = setInterval(asyncTick, config.asyncTickInterval || 2000)
    }

    // ========================================
    // 4. Подписка на события bot (если заданы)
    // ========================================
    const eventHandlers = new Map()

    if (config.onEvents) {
      const events = config.onEvents(api)

      for (const [eventName, handler] of Object.entries(events)) {
        const wrappedHandler = (...args) => {
          if (!internalState.isActive) return

          try {
            api.context = getContext()
            api.state = internalState

            handler(api, ...args)
          } catch (error) {
            console.error(`❌ Error in ${config.name} event ${eventName}:`, error)
          }
        }

        bot.on(eventName, wrappedHandler)
        eventHandlers.set(eventName, wrappedHandler)
      }
    }

    // ========================================
    // 5. Получение событий от машины (если задано)
    // ========================================
    if (config.onReceive) {
      receive((event) => {
        if (!internalState.isActive) return

        try {
          api.context = getContext()
          api.state = internalState
          api.event = event

          config.onReceive(api)
        } catch (error) {
          console.error(`❌ Error in ${config.name} onReceive:`, error)
        }
      })
    }

    // ========================================
    // CLEANUP
    // ========================================
    return () => {
      internalState.isActive = false

      // Отменяем все async операции
      abortController.abort()

      // Очищаем интервалы
      if (tickInterval) clearInterval(tickInterval)
      if (asyncTickInterval) clearInterval(asyncTickInterval)

      // Отписываемся от событий
      for (const [eventName, handler] of eventHandlers) {
        bot.off(eventName, handler)
      }

      // Пользовательский cleanup
      if (config.onCleanup) {
        try {
          config.onCleanup({ bot, state: internalState })
        } catch (error) {
          console.error(`❌ Error in ${config.name} onCleanup:`, error)
        }
      }
    }
  })
}