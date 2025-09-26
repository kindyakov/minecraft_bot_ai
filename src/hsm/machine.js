import { context } from './context.js'
import { states } from "./states/index.states.js"
import { actions } from './actions/index.actions.js'
import { services } from "./services/index.services.js"
import { guards } from './guards/index.guards.js'

export const machine = {
  id: 'MINECRAFT_BOT',
  type: "parallel",
  predictableActionArguments: true,
  preserveActionOrder: true,
  context,
  on: {
    SET_BOT: {
      actions: [{ type: "setBot" }]
    }
  },
  states,
}

export const optionsMachine = {
  actions,
  services,
  guards,
  delays: {}
}


