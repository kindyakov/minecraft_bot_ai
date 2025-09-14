import winston from 'winston';
import config from '../config/config.js';
import path from 'path';

/**
 * Создание корреляционного ID для трекинга операций
 */
function generateCorrelationId() {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Форматтер для логов с корреляционным ID
 */
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, correlationId, ...meta }) => {
    const corrId = correlationId ? `[${correlationId}]` : '';
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `${timestamp} [${level.toUpperCase()}]${corrId} ${message} ${metaStr}`.trim();
  })
);

/**
 * Настройка транспортов Winston
 */
const transports = [
  // Консольный вывод для разработки
  new winston.transports.Console({
    level: config.isDevelopment ? 'debug' : config.logging.level,
    format: winston.format.combine(
      winston.format.colorize(),
      logFormat
    )
  })
];

// Файловый транспорт для продакшена
if (config.isProduction || config.logging.file) {
  const logDir = path.dirname(path.resolve(config.logging.file));

  transports.push(
    // Общие логи
    new winston.transports.File({
      filename: config.logging.file,
      level: config.logging.level,
      format: logFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5
    }),
    // Отдельный файл для ошибок
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: logFormat,
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5
    })
  );
}

/**
 * Основной логгер Winston
 */
const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  transports,
  exitOnError: false
});

/**
 * Обертка логгера с поддержкой корреляционного ID
 */
class BotLogger {
  constructor() {
    this.correlationId = null;
  }

  /**
   * Установка корреляционного ID для цепочки операций
   * @param {string} [id] - корреляционный ID или генерируется автоматически
   */
  setCorrelationId(id = null) {
    this.correlationId = id || generateCorrelationId();
    return this.correlationId;
  }

  /**
   * Сброс корреляционного ID
   */
  clearCorrelationId() {
    this.correlationId = null;
  }

  /**
   * Создание лог-записи с корреляционным ID
   * @param {string} level - уровень лога
   * @param {string} message - сообщение
   * @param {Object} [meta] - дополнительные данные
   */
  log(level, message, meta = {}) {
    const logData = {
      ...meta,
      correlationId: this.correlationId
    };
    logger.log(level, message, logData);
  }

  debug(message, meta = {}) {
    this.log('debug', message, meta);
  }

  info(message, meta = {}) {
    this.log('info', message, meta);
  }

  warn(message, meta = {}) {
    this.log('warn', message, meta);
  }

  error(message, meta = {}) {
    this.log('error', message, meta);
  }

  /**
   * Логирование действий бота
   * @param {string} action - название действия
   * @param {string} status - статус (started, completed, failed)
   * @param {Object} [data] - дополнительные данные
   */
  botAction(action, status, data = {}) {
    const message = `Действие бота: ${action} - ${status}`;
    const level = status === 'failed' ? 'error' : 'info';

    this.log(level, message, {
      action,
      status,
      ...data
    });
  }

  /**
   * Логирование команд от игрока
   * @param {string} username - имя игрока
   * @param {string} command - команда
   * @param {Object} [params] - параметры команды
   */
  playerCommand(username, command, params = {}) {
    this.info(`Команда от игрока ${username}: ${command}`, {
      username,
      command,
      params
    });
  }

  /**
   * Логирование вызовов AI
   * @param {string} prompt - запрос к AI
   * @param {string} response - ответ AI
   * @param {number} duration - время выполнения в мс
   */
  aiCall(prompt, response, duration) {
    this.info('Вызов AI', {
      promptLength: prompt.length,
      responseLength: response.length,
      duration,
      model: config.ai.model
    });
  }

  /**
   * Логирование ошибок с трассировкой стека
   * @param {Error} error - объект ошибки
   * @param {string} [context] - контекст возникновения ошибки
   */
  exception(error, context = '') {
    this.error(`Ошибка${context ? ` в ${context}` : ''}: ${error.message}`, {
      error: error.stack,
      context
    });
  }
}

export default new BotLogger();