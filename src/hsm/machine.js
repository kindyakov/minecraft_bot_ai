import { context } from './context.js'
import { states } from "./states/index.states.js"

export const machine = {
  id: 'MINECRAFT_BOT',
  type: "parallel",
  predictableActionArguments: true,
  preserveActionOrder: true,
  context,
  states,
}
