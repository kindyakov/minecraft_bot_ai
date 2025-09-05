import MinecraftBot from "./core/bot.js";
import Logger from "./core/logger.js";

const minecraftBot = new MinecraftBot();

minecraftBot.start();

process.on("SIGINT", () => {
  Logger.info("Остановка бота...");
  minecraftBot.stop("Выключение сервера");
  process.exit();
});