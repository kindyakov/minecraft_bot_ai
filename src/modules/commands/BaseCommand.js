export class BaseCommand {
  constructor(name = "_") {
    this.name = name
  }

  execute(bot, { username, options }) {
    throw new Error(`Команда ${this.name} не реализовала execute()`)
  }

  stop() {

  }
}
