import { WebSocketServer } from 'ws';

/**
 * Рекурсивная замена BigInt на строку и удаление циклических ссылок
 */
function sanitizeValue(obj, seen = new WeakSet()) {
  // Примитивы
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return obj;
  if (typeof obj === 'number') return obj;
  if (typeof obj === 'boolean') return obj;

  // BigInt → String
  if (typeof obj === 'bigint') {
    return obj.toString();
  }

  // Функции игнорируем
  if (typeof obj === 'function') {
    return '[Function]';
  }

  // Проверка циклических ссылок
  if (typeof obj === 'object') {
    if (seen.has(obj)) {
      return '[Circular]';
    }
    seen.add(obj);

    // Массивы
    if (Array.isArray(obj)) {
      return obj.map(item => sanitizeValue(item, seen));
    }

    // Объекты
    const result = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        try {
          result[key] = sanitizeValue(obj[key], seen);
        } catch (e) {
          result[key] = '[Error]';
        }
      }
    }
    return result;
  }

  return obj;
}

/**
 * Санитизация контекста для Inspector
 */
function sanitizeContext(context) {
  if (!context) {
    return { status: 'context not initialized' };
  }

  return {
    health: context.health ?? 0,
    food: context.food ?? 0,
    oxygen: context.oxygen ?? 0,
    foodSaturation: context.foodSaturation ?? 0,
    weather: context.weather ?? null,
    timeOfDay: context.timeOfDay ?? null,
    entitiesCount: context.entities?.length ?? 0,
    enemiesCount: context.enemies?.length ?? 0,
    playersCount: context.players?.length ?? 0,
    inventoryCount: context.inventory?.length ?? 0,
    toolDurability: sanitizeValue(context.toolDurability),
    armorDurability: sanitizeValue(context.armorDurability),
    position: context.position ? {
      x: context.position.x?.toFixed?.(2) ?? context.position.x,
      y: context.position.y?.toFixed?.(2) ?? context.position.y,
      z: context.position.z?.toFixed?.(2) ?? context.position.z
    } : null,
    tasksCount: context.tasks?.length ?? 0,
    preferences: sanitizeValue(context.preferences),
    nearestEnemy: context.nearestEnemy ? {
      distance: context.nearestEnemy.distance?.toFixed?.(2) ?? 'Infinity',
      hasEnemy: context.nearestEnemy.entity !== null
    } : null
  };
}

/**
 * Санитизация события (удаляет bot, entity и другие опасные объекты)
 */
function sanitizeEvent(event) {
  if (!event || typeof event !== 'object') {
    return event;
  }

  const { type, ...payload } = event;

  // Список полей которые нужно удалить
  const dangerousFields = ['bot', 'entity', 'entities', 'enemies', 'player'];

  const safePayload = {};
  for (const key in payload) {
    if (!dangerousFields.includes(key)) {
      // Санитизируем значение (может содержать BigInt или циклические ссылки)
      safePayload[key] = sanitizeValue(payload[key]);
    }
  }

  return {
    type,
    ...safePayload
  };
}

/**
 * Создаёт локальный WebSocket сервер для инспекции XState
 */
export function createLocalInspector(port = 8080) {
  const wss = new WebSocketServer({ port });

  console.log(`🔍 XState Inspector запущен на ws://localhost:${port}`);
  console.log(`📊 Открой Stately Viz: https://stately.ai/viz?inspect&server=ws://localhost:${port}`);

  const clients = new Set();

  wss.on('connection', (ws) => {
    console.log('✅ Inspector клиент подключен');
    clients.add(ws);

    ws.on('close', () => {
      console.log('❌ Inspector клиент отключен');
      clients.delete(ws);
    });

    ws.on('error', (err) => {
      console.error('❌ WebSocket ошибка:', err.message);
      clients.delete(ws);
    });
  });

  wss.on('error', (err) => {
    console.error('❌ WebSocket Server ошибка:', err.message);
  });

  /**
   * Отправка данных всем подключённым клиентам
   */
  function broadcast(data) {
    try {
      const message = JSON.stringify(data);
      clients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket.OPEN
          try {
            client.send(message);
          } catch (err) {
            console.error('❌ Ошибка отправки:', err.message);
          }
        }
      });
    } catch (err) {
      console.error('❌ Ошибка JSON.stringify:', err.message);
    }
  }

  return {
    /**
     * Создаёт inspector функцию для XState
     */
    inspect: (inspectionEvent) => {
      try {
        if (inspectionEvent.type === '@xstate.actor') {
          const snapshot = inspectionEvent.actorRef?.getSnapshot?.();

          if (snapshot) {
            broadcast({
              type: 'actor.register',
              actorRef: inspectionEvent.actorRef.id,
              snapshot: {
                status: snapshot.status,
                value: sanitizeValue(snapshot.value), // ← Санитизируем value
                context: sanitizeContext(snapshot.context)
              }
            });
          }
        }

        if (inspectionEvent.type === '@xstate.snapshot') {
          const snapshot = inspectionEvent.snapshot;

          if (snapshot) {
            broadcast({
              type: 'actor.snapshot',
              actorRef: inspectionEvent.actorRef?.id,
              event: sanitizeEvent(inspectionEvent.event), // ← Санитизируем event
              snapshot: {
                status: snapshot.status,
                value: sanitizeValue(snapshot.value), // ← Санитизируем value
                context: sanitizeContext(snapshot.context)
              }
            });
          }
        }

        if (inspectionEvent.type === '@xstate.event') {
          broadcast({
            type: 'actor.event',
            actorRef: inspectionEvent.actorRef?.id,
            event: sanitizeEvent(inspectionEvent.event) // ← Санитизируем event
          });
        }
      } catch (error) {
        console.error('❌ Inspector error:', error.message);
        // НЕ останавливаем работу бота, просто пропускаем это событие
      }
    },

    /**
     * Закрыть WebSocket сервер
     */
    close: () => {
      clients.forEach(client => client.close());
      wss.close();
      console.log('🔴 Inspector остановлен');
    }
  };
}