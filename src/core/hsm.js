import EventEmitter from 'node:events';
import { createMachine, createActor } from 'xstate';
import { createBrowserInspector } from '@statelyai/inspect';
import { machine } from '../hsm/machine.js';
import logger from '../config/logger.js';

import { actions } from '../hsm/actions/index.actions.js'
import { services } from "../hsm/services/index.services.js"
import { guards } from '../hsm/guards/index.guards.js'

const inspector = createBrowserInspector();

class BotStateMachine extends EventEmitter {
  constructor(bot) {
    super()
    this.bot = bot
    this.machine = createMachine(machine, {
      actions,
      services,
      guards,
      delays: {}
    })
    this.init()
  }

  init() {
    console.log('HSM...')

    this.actor = createActor(this.machine, {
      inspect: inspector.inspect
    })

    console.log('HSM машина создана')

    this.setupBotEvents()
    this.handlers()

    this.actor.start()
    console.log('HSM актор запущен')
    console.log('Активные состояния', this.actor.getSnapshot().value)
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

  setupBotEvents() {
    // Обновление здоровья
    this.bot.on('health', () => {
      this.actor.send({
        type: 'UPDATE_HEALTH',
        health: this.bot.health
      })
    })

    // Обновление голода  
    this.bot.on('food', () => {
      this.actor.send({
        type: 'UPDATE_FOOD',
        food: this.bot.food
      })
    })

    // Обновление сущностей
    this.bot.on('entitySpawn', (entity) => {
      this.actor.send({
        type: 'UPDATE_ENTITIES',
        entities: this.getEntitiesData()
      })
    })
  }

  getEntitiesData() {
    return Object.values(this.bot.entities)
      .filter(e => e.type === 'hostile')
  }
}

export default BotStateMachine