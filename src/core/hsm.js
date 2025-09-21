import EventEmitter from 'node:events';
import { createMachine, createActor } from 'xstate';
import { machine } from '../hsm/machine.js';
import logger from '../config/logger.js';

class BotStateMachine extends EventEmitter {
  constructor(bot) {
    super()
    this.bot = bot
    this.machine = createMachine(machine)
    this.init()
  }

  init() {
    this.actor = createActor(this.machine, {
      inspect: {
        url: 'https://stately.ai/viz?inspect'
      }
    })
    this.actor.start()
    this.handlers()
  }

  handlers() {
    this.on('player-command', (commandName, options) => {

      if (commandName === 'stop') {
        this.actor.send({ type: 'IDLE' });
      } else {
        this.actor.send({ type: commandName });
      }
    })
  }
}

export default BotStateMachine