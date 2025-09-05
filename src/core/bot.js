import MineFlayer from "mineflayer"
import Config from "./config.js"
import Logger from "./logger.js"
import { initConnection } from "../modules/connection/index.js"

class MinecraftBot {
  constructor() {
    this.bot = null
    this.isConnected = false
    this.currentState = 'IDLE'
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000
  }

  start() {
    try {
      Logger.info('Запуск бота...');

      this.bot = MineFlayer.createBot({
        host: Config.minecraft.host,
        username: Config.minecraft.username,
        port: Config.minecraft.port,
        version: Config.minecraft.version,
      })

      initConnection(this)
    } catch (error) {
      Logger.error('Ошибка запуска бота:', error);
      this.scheduleReconnect()
    }
  }

  stop(reason = 'Бот остановлен вручную.') {
    if (!this.bot) {
      Logger.warn('Попытка остановить бота, который не был запущен.');
      return
    }
    Logger.info('Отключение бота...');
    this.bot.quit(reason);
  }

  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      Logger.error("Превышено число попыток реконнекта. Бот больше не подключается.")
      return
    }

    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts) // экспоненциально
    Logger.info(`Попытка реконнекта через ${delay / 1000} секунд...`)

    this.reconnectAttempts++
    setTimeout(() => this.start(), delay)
  }

  /**
   * Выполняет команду в чате.
   * @param {string} command - Команда для выполнения (например, /say, /tp).
   * @param {string[]} params - Параметры команды.
   */
  executeCommand(command, params = []) {
    if (!this.isConnected) {
      Logger.warn('Попытка выполнить команду без подключения к серверу.');
      return;
    }
    const fullCommand = `${command} ${params.join(' ')}`.trim();
    Logger.info(`Выполнение команды: "${fullCommand}"`);
  }

  /**
  * Устанавливает новое состояние для конечного автомата (FSM).
  * @param {string} newState - Новое состояние (IDLE, FOLLOW, GUARD и т.д.).
  */
  setState(newState) {
    Logger.info(`Смена состояния: ${this.currentState} -> ${newState}`);
    this.currentState = newState;
    // Здесь может быть логика для запуска/остановки задач, связанных с состоянием
  }

  getCurrentPosition() {
    if (!this.isConnected) {
      Logger.warn('Попытка получить координаты бота без подключения к серверу.');
      return null;
    }
    return this.bot.entity.position;
  }
}

export default MinecraftBot