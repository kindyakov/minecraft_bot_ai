import EventEmitter from 'node:events';
import { createMachine, createActor } from 'xstate';
import { createBrowserInspector } from '@statelyai/inspect';
import { machine, optionsMachine } from '../hsm/machine.js';

const inspector = createBrowserInspector();

class BotStateMachine extends EventEmitter {
  constructor(bot) {
    super()
    this.bot = bot

    this.machine = createMachine(machine, optionsMachine)
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
        entities: Object.values(this.bot.entities).filter(e => e.type === 'hostile')
      })
    })

    this.bot.on('weatherUpdate', (weather) => {
      console.log('Изменилась погода', weather)
      // this.actor.send({
      //   type: 'UPDATA_WEATHER',
      //   weather
      // })
    })
  }
}

export default BotStateMachine