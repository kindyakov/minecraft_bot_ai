import EventEmitter from 'node:events';
import { createActor } from 'xstate';
import { createSkyInspector } from '@statelyai/inspect';
import { machine } from '../hsm/machine.js';

class BotStateMachine extends EventEmitter {
  constructor(bot) {
    super()
    this.bot = bot

    this.machine = machine
    this.init()
  }

  init() {
    // const inspector = createSkyInspector();
    // inspector.start?.();

    this.actor = createActor(this.machine, {
      // inspect: inspector.inspect
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
      this.actor.send({
        type: 'UPDATE_SATURATION',
        foodSaturation: this.bot.foodSaturation
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
    })

    this.bot.on('death', () => {
      this.actor.send({ type: 'DEATH' });
    })

    // Событие сработает когда снаряд летит в бота
    this.bot.on('incoming_projectil', (projectil, arrowTrajectory) => {
      // projectil - летящая стрела
      // arrowTrajectory - её траектория
    })

    // Пропала сужность
    // this.bot.on('entityGone', (entity) => {
    //   this.actor.send({
    //     type: 'REMOVE_ENTITY',
    //     entity
    //   })
    // })

    this.bot.on('goal_reached', (goal) => {
      const snapshot = this.actor.getSnapshot()
      const isFleeing = snapshot.matches({ MAIN_ACTIVITY: { COMBAT: 'FLEEING' } })
      console.log('❗❗ добежал')

      if (isFleeing) {
        this.actor.send({ type: 'FLEE_GOAL_REACHED' })
      }
    })

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

    // this.bot.on('goal_reached', (goal) => {
    //   console.log('🎯 Goal reached!', goal)
    // })

    this.bot.on('goal_updated', (goal) => {
      // console.log('🔄 Goal updated:', goal)
    })

    this.bot.on('path_update', (results) => {
      console.log('🛤️ Path update:', results.status)
    })
  }
}

export default BotStateMachine