import EventEmitter from 'node:events';
import MineFlayer from "mineflayer"
import Config from "./config.js"
import Logger from "./logger.js"
import CommandState from './cmdSate.js';
import { loadPlugins } from '../modules/plugins/index.js';
import { initConnection } from "../modules/connection/index.js"

class MinecraftBot extends EventEmitter {
  constructor() {
    super();
    this.bot = null
    this.cmdState = new CommandState()
    this.isConnected = false
    this.currentState = 'IDLE'
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000
  }

  start() {
    try {
      Logger.info('Запуск бота...');

      if (this.bot) {
        Logger.warn('Бот уже запущен!')
        return
      }

      this.bot = MineFlayer.createBot({
        host: Config.minecraft.host,
        username: Config.minecraft.username,
        port: Config.minecraft.port,
        version: Config.minecraft.version,
      })

      this.bot.cmdState = this.cmdState

      this.bot.on('botReady', () => {
        this.isConnected = true
        this.reconnectAttempts = 0 // сброси счётчик
        this.bot.chat("Я готов к работе ;)")
      })

      this.bot.on('botDisconnected', (reason) => {
        this.isConnected = false
        this.bot = null
        this.scheduleReconnect()
      })

      loadPlugins(this.bot)
      initConnection(this.bot)
    } catch (error) {
      Logger.error('Ошибка запуска бота:', error);
      this.isConnected = false
      this.bot = null
      this.scheduleReconnect()
    }
  }

  stop(reason = 'Бот остановлен вручную.') {
    if (!this.bot) {
      Logger.warn('Попытка остановить бота, который не был запущен.');
      return
    }
    this.isConnected = false
    Logger.info('Отключение бота...');
    this.bot.quit(reason);
    this.bot = null
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
}

export default MinecraftBot