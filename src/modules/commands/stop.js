import { BaseCommand } from "./BaseCommand.js"

class Stop extends BaseCommand {
  constructor() {
    super('stop')
  }

  execute({ bot }) {
    bot.chat('Остановлен!')
  }
}

export const stop = new Stop()