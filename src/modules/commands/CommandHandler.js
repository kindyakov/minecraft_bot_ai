import logger from "../../config/logger.js"
import { follow } from "./follow.js"
import { help } from "./help.js"
import { stop } from "./stop.js"
import { guard } from "./guard.js"

export class CommandHandler {
  constructor(bot) {
    this.bot = bot
    this.init()
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
      // Если есть активные команды то останавливаем их
      if (this.bot.cmdState?.activeCommands.size !== 0) {
        this.bot.cmdState.stopAllCommands(this.bot)
      }

      this.bot.fsm.emit('PLAYER_COMMAND', {
        command,
        options,
        username,
        timestamp: Date.now()
      })

      // this.commands[command].execute({
      //   bot: this.bot,
      //   options,
      //   username,
      //   availableCommands: Object.keys(this.commands),
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