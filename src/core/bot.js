import EventEmitter from 'node:events';
import MineFlayer from "mineflayer"
import BotStateMachine from "./fsm.js"
import SurvivalSystem from './survival.js';
import Config from "../config/config.js"
import Logger from "../config/logger.js"
import { initConnection } from "../modules/connection/index.js"
import { CommandHandler } from "../modules/commands/CommandHandler.js"
import { BotUtils } from '../utils/minecraft/botUtils.js';

class MinecraftBot extends EventEmitter {
  constructor() {
    super();
    this.bot = null
    this.isConnected = false
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

      this.bot = MineFlayer.createBot(Config.minecraft)

      this.bot.on('botReady', () => {
        this.isConnected = true
        this.reconnectAttempts = 0 // сброси счётчик

        this.bot.utils = new BotUtils(this.bot)
        const fsm = new BotStateMachine(this.bot)
        const commandHandler = new CommandHandler(this.bot, fsm)
        const survivalSystem = new SurvivalSystem(this.bot, fsm)

        this.bot.chat("Я готов к работе ;)")
      })

      this.bot.on('botDisconnected', (reason) => {
        this.isConnected = false
        this.bot = null
        this.scheduleReconnect()
      })

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