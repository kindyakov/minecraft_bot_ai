import logger from "../../config/logger.js"
import { commands } from "./index.commands.js"

export class CommandHandler {
  constructor(bot) {
    this.bot = bot
    this.init()
  }

  init() {
    if (!this.bot) {
      logger.error('Не обнаружен экземпляр бота')
      return
    }

    this.bot.on('chat', this.chat.bind(this))
  }

  chat(username, message) {
    if (username === this.bot.username) return

    const parsed = this.parseMessage(message)
    if (!parsed.length) return // не команда

    const [command, options] = parsed

    if (commands[command]) {
      this.bot.fsm.emit('PLAYER_COMMAND', {
        command,
        options,
        username,
        timestamp: Date.now()
      })

      // commands[command].execute({
      //   bot: this.bot,
      //   options,
      //   username,
      //   availableCommands: Object.keys(commands),
      // })

      logger.playerCommand(`Команда от ${username}: ${command}`, options)
    } else {
      this.bot.chat(`Неизвестная команда: ${command}`)
    }
  }

  parseMessage(msg = '') {
    if (!msg) return []
    let text = msg.trim()
    // Если сообщение пустое или не начинается на символ ":" то останавливаем код
    if (!text || !text.startsWith(':')) return []
    const [command, ...options] = text.slice(1).split(' '); // возвращает все после ":"
    return [command.toLocaleLowerCase(), options]
  }
}