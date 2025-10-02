import { WebSocketServer } from 'ws';

/**
 * Санитизация контекста для Inspector
 */
function sanitizeContext(context) {
  // Проверка на существование контекста
  if (!context) {
    return { status: 'context not initialized' };
  }

  return {
    health: context.health ?? 0,
    food: context.food ?? 0,
    // oxygen: context.oxygen ?? 0,
    // foodSaturation: context.foodSaturation ?? 0,
    // weather: context.weather ?? null,
    // timeOfDay: context.timeOfDay ?? null,
    // entitiesCount: context.entities?.length ?? 0,
    // enemiesCount: context.enemies?.length ?? 0,
    // playersCount: context.players?.length ?? 0,
    // inventoryCount: context.inventory?.length ?? 0,
    // toolDurability: context.toolDurability ?? null,
    // armorDurability: context.armorDurability ?? null,
    // position: context.position ? {
    //   x: context.position.x?.toFixed?.(2) ?? context.position.x,
    //   y: context.position.y?.toFixed?.(2) ?? context.position.y,
    //   z: context.position.z?.toFixed?.(2) ?? context.position.z
    // } : null,
    // tasksCount: context.tasks?.length ?? 0,
    // preferences: context.preferences ?? null,
    // nearestEnemy: context.nearestEnemy ? {
    //   distance: context.nearestEnemy.distance?.toFixed?.(2) ?? 'Infinity',
    //   hasEnemy: context.nearestEnemy.entity !== null
    // } : null
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
  }

  return {
    /**
     * Создаёт inspector функцию для XState
     */
    inspect: (inspectionEvent) => {
      // XState v5 использует inspect callback
      // Документация: https://stately.ai/docs/inspection

      try {
        if (inspectionEvent.type === '@xstate.actor') {
          const snapshot = inspectionEvent.actorRef?.getSnapshot?.();

          // Проверяем что snapshot существует
          if (snapshot) {
            broadcast({
              type: 'actor.register',
              actorRef: inspectionEvent.actorRef.id,
              snapshot: {
                status: snapshot.status,
                value: snapshot.value,
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
              event: inspectionEvent.event,
              snapshot: {
                status: snapshot.status,
                value: snapshot.value,
                context: sanitizeContext(snapshot.context)
              }
            });
          }
        }

        if (inspectionEvent.type === '@xstate.event') {
          broadcast({
            type: 'actor.event',
            actorRef: inspectionEvent.actorRef?.id,
            event: {
              type: inspectionEvent.event?.type || 'unknown',
              // Не отправляем payload, если там bot или entity
            }
          });
        }
      } catch (error) {
        console.error('❌ Inspector error:', error.message);
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