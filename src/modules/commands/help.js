import { BaseCommand } from "./BaseCommand.js"

class Help extends BaseCommand {
  constructor() {
    super('help')
  }

  execute({ bot, availableCommands }) {
    if (!availableCommands.length) return
    const message = `Команды: ${availableCommands.map(cmd => `:${cmd}`).join(', ')}`
    bot.chat(message)
  }
}

export const help = new Help()