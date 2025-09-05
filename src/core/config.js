

import 'dotenv/config';

class Config {
  constructor() {
    this.validateEnv()
  }

  // Minecraft настройки
  get minecraft() {
    return {
      host: process.env.MINECRAFT_HOST || 'localhost',
      port: parseInt(process.env.MINECRAFT_PORT) || 25565,
      username: process.env.MINECRAFT_USERNAME || 'bot',
      version: process.env.MINECRAFT_VERSION || '1.20.1'
    };
  }

  // AI настройки
  get ai() {
    return {
      provider: process.env.AI_PROVIDER || 'openai',
      model: process.env.AI_MODEL || 'gpt-4o-mini',
      apiKey: process.env.AI_API_KEY,
      timeout: parseInt(process.env.AI_TIMEOUT_MS) || 800,
      maxTokens: parseInt(process.env.AI_MAX_TOKENS) || 300
    };
  }

  // Логирование
  get logging() {
    return {
      level: process.env.LOG_LEVEL || 'info',
      file: process.env.LOG_FILE || 'logs/bot.log'
    };
  }

  // Безопасность
  get security() {
    return {
      maxTaskDuration: parseInt(process.env.MAX_TASK_DURATION_MS) || 30000,
      dangerousBlocksCheck: process.env.DANGEROUS_BLOCKS_CHECK !== 'false',
      maxHeight: parseInt(process.env.MAX_HEIGHT) || 256,
      minHeight: parseInt(process.env.MIN_HEIGHT) || -64
    };
  }

  // Поведение бота
  get behavior() {
    return {
      followDistance: parseFloat(process.env.FOLLOW_DISTANCE) || 3,
      idleCheckInterval: parseInt(process.env.IDLE_CHECK_INTERVAL_MS) || 5000,
      aiDecisionInterval: parseInt(process.env.AI_DECISION_INTERVAL_MS) || 10000
    };
  }

  /**
   * Валидация обязательных переменных окружения
   */
  validateEnv() {
    const required = [
      'MINECRAFT_USERNAME',
      'AI_API_KEY'
    ];

    const missing = required.filter(key => !process.env[key]);


    if (missing.length > 0) {
      throw new Error(`Отсутствуют обязательные переменные окружения: ${missing.join(', ')}`);
    }

    // Валидация AI провайдера
    const validProviders = ['openai', 'anthropic', 'local'];
    if (!validProviders.includes(this.ai.provider)) {
      throw new Error(`Неверный AI провайдер: ${this.ai.provider}. Поддерживаются: ${validProviders.join(', ')}`);
    }
  }

  /**
   * Получение конфигурации для определенного окружения
   */
  get isDevelopment() {
    return process.env.NODE_ENV === 'development';
  }

  get isProduction() {
    return process.env.NODE_ENV === 'production';
  }
}

export default new Config();