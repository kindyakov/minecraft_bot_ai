import logger from "../../core/logger.js"
import { follow } from "./commands/follow.js"
import { help } from "./commands/help.js"
import { stop } from "./commands/stop.js"
import { guard } from "./commands/guard.js"

export class CommandHandler {
  constructor(bot) {
    this.bot = bot
  }

  commands = {
    follow,
    help,
    stop,
    guard,
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

    if (this.commands[command]) {
      this.commands[command].execute({
        bot: this.bot,
        options,
        username,
        availableCommands: Object.keys(this.commands),
      })

      logger.info(`Команда от ${username}: ${command}`, options)
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