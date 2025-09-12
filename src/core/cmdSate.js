export default class CommandState {
  constructor() {
    this.activeCommands = new Set()
  }

  registerCommand(command) {
    this.activeCommands.add(command)
  }

  unregisterCommand(command) {
    this.activeCommands.delete(command)
  }

  stopAllCommands(bot) {
    this.activeCommands.forEach(cmd => {
      if (cmd.stop && cmd.isActive) {
        cmd.stop(bot)
      }
    })
    this.activeCommands.clear()
  }
}