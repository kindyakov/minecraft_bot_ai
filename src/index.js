import mineflayer from "mineflayer";
import Config from "./core/config.js";

const bot = mineflayer.createBot({
  host: Config.minecraft.host,
  username: Config.minecraft.username,
  port: Config.minecraft.port,
  version: Config.minecraft.version,
  auth: 'offline',
})

bot.on('chat', (username, message) => {
  if (username === bot.username) return
  bot.chat(message)
})

// bot.on('kicked', console.log)
bot.on('error', (err) => {
  console.log(err)
})