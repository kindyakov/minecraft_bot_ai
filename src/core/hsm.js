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

  handleEntityUpdate(entity) {
    const { preferences } = this.actor.getSnapshot().context;
    const distance = entity.position.distanceTo(this.bot.entity.position);

    if (distance <= preferences.maxObservDist) {
      this.actor.send({
        type: 'UPDATE_ENTITIES',
        entity
      });
      return true
    }

    return false
  }

  setupBotEvents() {
    // Обновление здоровья
    this.bot.on('health', () => {
      console.log("Здоровье:", this.bot.health.toFixed(1))
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

    this.bot.on('move', () => {
      this.actor.send({
        type: 'UPDATE_POSITION',
        position: this.bot.entity.position
      })

      this.actor.send({
        type: 'UPDATE_SATURATION',
        foodSaturation: this.bot.foodSaturation
      })
    })

    // Пропала сужность
    // this.bot.on('entityGone', (entity) => {
    //   this.actor.send({
    //     type: 'REMOVE_ENTITY',
    //     entity
    //   })
    // })

    this.bot.on('entityDead', (entity) => {
      this.actor.send({
        type: 'REMOVE_ENTITY',
        entity
      })
    })

    // Выпал предмет
    this.bot.on('itemDrop', (entity) => {
      // Если элеменнт сломан
      if (entity.name === 'broken_item') {
        this.actor.send({ type: 'WEAPON_BROKEN' })
      }
    })
  }
}

export default BotStateMachine