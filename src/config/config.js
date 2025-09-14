import 'dotenv/config';

class Config {
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