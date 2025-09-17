import { BaseCommand } from "./BaseCommand.js"
import { commands } from "./index.commands.js"

class Help extends BaseCommand {
  constructor() {
    super('help')
  }

  execute({ bot }) {
    // const message = `Команды: ${availableCommands.map(cmd => `:${cmd}`).join(', ')}`
    // bot.chat(message)
  }
}

export const help = new Help()