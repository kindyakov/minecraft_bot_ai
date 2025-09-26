import EventEmitter from 'node:events';
import { createActor } from 'xstate';
import { createBrowserInspector } from '@statelyai/inspect';
import { machine } from '../hsm/machine.js';

class BotStateMachine extends EventEmitter {
  constructor(bot) {
    super()
    this.bot = bot

    this.machine = machine
    this.init()
  }

  init() {
    this.actor = createActor(this.machine, {
      inspect: createBrowserInspector().inspect
    })

    console.log('HSM машина создана')

    this.setupBotEvents()
    this.handlers()

    this.actor.start()

    this.actor.send({
      type: 'SET_BOT',
      bot: this.bot
    });

    console.log('HSM актор запущен')
    console.log('Активные состояния', this.actor.getSnapshot().value)
  }

  handlers() {
    this.on('player-command', (commandName, options) => {

      if (commandName === 'stop') {
        this.actor.send({ type: 'PLAYER_STOP' });
      } else {
        this.actor.send({ type: commandName });
      }
    })
  }

  setupBotEvents() {
    // Обновление здоровья
    this.bot.on('health', () => {
      console.log("Здоровье:", this.bot.health)
      this.actor.send({
        type: 'UPDATE_HEALTH',
        health: this.bot.health
      })
    })

    // Обновление голода  
    this.bot.on('food', () => {
      console.log("Голод:", this.bot.food)
      this.actor.send({
        type: 'UPDATE_FOOD',
        food: this.bot.food
      })
    })

    // Обновление кислорода  
    this.bot.on('breath', () => {
      this.actor.send({
        type: 'UPDATE_OXYGEN',
        food: this.bot.oxygenLevel
      })
    })

    // Обновление сущностей
    this.bot.on('entitySpawn', (entity) => {
      this.actor.send({
        type: 'UPDATE_ENTITIES',
        entity
      })
    })

    this.bot.on('move', () => {
      this.actor.send({
        type: 'UPDATE_POSITION',
        position: this.bot.entity.position
      })
    })
  }
}

export default BotStateMachine