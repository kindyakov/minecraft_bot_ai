import EventEmitter from 'node:events';
import { createActor } from 'xstate';
import { createLocalInspector } from './inspector.js';
import { machine } from '../hsm/machine.js';
import { AntiLoopGuard } from '../hsm/utils/antiLoop.js';

class BotStateMachine extends EventEmitter {
  constructor(bot) {
    super();
    this.bot = bot;
    this.machine = machine;

    // Защита от зацикливания
    this.antiLoopGuard = new AntiLoopGuard({
      maxTransitionsPerSecond: 15,
      emergencyStopAfter: 100,
      windowMs: 1000
    });

    this.inspector = createLocalInspector(8080);

    this.init();
  }

  init() {
    this.actor = createActor(this.machine, {
      inspect: this.inspector.inspect
    });

    console.log('HSM машина создана');

    this.setupAntiLoopObserver();
    this.setupBotEvents();
    this.handlers();

    this.actor.start();

    this.actor.send({
      type: 'SET_BOT',
      bot: this.bot
    });

    console.log('HSM актор запущен');
    console.log('Активные состояния', this.actor.getSnapshot().value);
  }

  setupAntiLoopObserver() {
    let lastState = null;
    let lastTransitionTime = Date.now();
    let rapidTransitionCount = 0;

    this.actor.subscribe((snapshot) => {
      const currentState = this.getStateString(snapshot.value);
      const now = Date.now();

      if (lastState && lastState !== currentState) {
        const timeSinceLastTransition = now - lastTransitionTime;

        const isAllowed = this.antiLoopGuard.recordTransition(lastState, currentState);

        if (!isAllowed) {
          console.error('');
          console.error('🚨 Остановка бота из-за зацикливания!');
          console.error('Статистика:', this.antiLoopGuard.getStats());
          console.error('');

          this.stop()

          if (this.bot && this.bot.chat) {
            this.bot.chat('⚠️ Произошла критическая ошибка! Остановка...');
          }

          setTimeout(() => {
            process.exit(1);
          }, 1000);

          return;
        }

        if (timeSinceLastTransition < 50) {
          rapidTransitionCount++;

          if (rapidTransitionCount > 20) {
            console.error(`🚨 CRITICAL: ${rapidTransitionCount} rapid transitions (< 50ms)`);
            console.error(`${lastState} → ${currentState}`);
          }
        } else {
          rapidTransitionCount = 0;
        }

        lastTransitionTime = now;
      }

      lastState = currentState;
    });
  }

  getStateString(stateValue) {
    if (typeof stateValue === 'string') {
      return stateValue;
    }

    if (typeof stateValue === 'object') {
      return JSON.stringify(stateValue);
    }

    return String(stateValue);
  }

  handlers() {
    this.on('player-command', (commandName, options) => {
      if (commandName === 'stop') {
        this.actor.send({ type: 'PLAYER_STOP' });
      } else {
        this.actor.send({ type: commandName });
      }
    });
  }

  setupBotEvents() {
    this.bot.on('health', () => {
      console.log("Здоровье:", this.bot.health.toFixed(1));
      this.actor.send({
        type: 'UPDATE_HEALTH',
        health: this.bot.health
      });
    });

    this.bot.on('food', () => {
      console.log("Голод:", this.bot.food);
      this.actor.send({
        type: 'UPDATE_FOOD',
        food: this.bot.food
      });
      this.actor.send({
        type: 'UPDATE_SATURATION',
        foodSaturation: this.bot.foodSaturation
      });
    });

    this.bot.on('breath', () => {
      this.actor.send({
        type: 'UPDATE_OXYGEN',
        food: this.bot.oxygenLevel
      });
    });

    this.bot.on('move', () => {
      this.actor.send({
        type: 'UPDATE_POSITION',
        position: this.bot.entity.position
      });
    });

    this.bot.on('death', () => {
      this.actor.send({ type: 'DEATH' });
    });

    this.bot.on('goal_reached', (goal) => {
      const snapshot = this.actor.getSnapshot();
      const isFleeing = snapshot.matches({ MAIN_ACTIVITY: { COMBAT: 'FLEEING' } });
      console.log('❗❗ добежал');

      if (isFleeing) {
        this.actor.send({ type: 'FLEE_GOAL_REACHED' });
      }
    });

    this.bot.on('entityDead', (entity) => {
      this.actor.send({
        type: 'REMOVE_ENTITY',
        entity
      });
    });

    this.bot.on('itemDrop', (entity) => {
      if (entity.name === 'broken_item') {
        this.actor.send({ type: 'WEAPON_BROKEN' });
      }
    });
  }

  stop() {
    this.actor.stop();
    this.inspector.close();
  }
}

export default BotStateMachine;