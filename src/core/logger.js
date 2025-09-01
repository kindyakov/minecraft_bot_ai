import winston from "winston";
import path from "path";
import fs from "fs";
import Config from "./config.js";

// Гарантируем, что директория для логов существует
const logDir = path.dirname(Config.logging.file);
fs.mkdirSync(logDir, { recursive: true });

const { combine, timestamp, printf, colorize, errors, splat } = winston.format;

// Формат сообщений: 2024-05-12T10:40:20.123Z [info] : текст
const logFormat = printf(({ level, message, timestamp, stack, correlationId }) => {
  const base = `${timestamp} [${level}]`;
  const cid = correlationId ? ` [cid:${correlationId}]` : "";
  const msg = stack || message;
  return `${base}${cid} : ${msg}`;
});

const logger = winston.createLogger({
  level: Config.logging.level,
  format: combine(
    timestamp(),
    splat(),
    errors({ stack: true })
  ),
  transports: [
    // Вывод в консоль с цветами (удобно при разработке)
    new winston.transports.Console({
      level: Config.isProduction ? "info" : "debug",
      format: combine(colorize(), logFormat)
    }),
    // Запись в файл
    new winston.transports.File({
      filename: Config.logging.file,
      maxsize: 5 * 1024 * 1024,   // 5 МБ
      maxFiles: 5,                // храним 5 архивов
      level: Config.logging.level,
      format: logFormat
    })
  ]
});

// Позволяет создать дочерний логгер с correlation ID
export const withCorrelationId = (id) => logger.child({ correlationId: id });

export default logger;