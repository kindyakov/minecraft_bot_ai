// import { inspect } from '@xstate/inspect';
import 'dotenv/config';

import MinecraftBot from "./core/bot.js";
import Logger from "./config/logger.js";

const minecraftBot = new MinecraftBot();
minecraftBot.start();

process.on("SIGINT", () => {
  Logger.info("Остановка бота...");
  minecraftBot.stop("Выключение сервера");
  process.exit();
});

// if (process.env.NODE_ENV === 'development') {
//   inspect({
//     url: 'https://statecharts.io/inspect',
//     iframe: false
//   });
// }