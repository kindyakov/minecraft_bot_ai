/**
  * @param {object} fsm - контекст FSM
  * @param {string} stateName - название состояния
 */
export class BaseState {
  constructor(fsm, stateName, priority = 7) {
    this.fsm = fsm
    this.name = stateName
    this.priority = priority
    this.status = 'inactive'
    this._timerUpdate = null
    this._timeout = 500
  }

  /**
     * @param {Object} bot - экземпляр бота
     * @param {Object} [options] - параметры состояния
     */
  enter(bot, options = {}) {
    logger.info(`Enter state ${this.name}`)
  }

  /**
   * @param {Object} bot - экземпляр бота
  */
  update(bot) {
    logger.info(`Update state ${this.name}`)
  }

  /**
  * @param {Object} bot - экземпляр бота
 */
  exit(bot) {
    clearInterval(this._timerUpdate)
    this._timerUpdate = null
    logger.info(`Exit state ${this.name}`)
  }

  /**
 * @param {Object} bot - экземпляр бота
 */
  pause(bot) {
    clearInterval(this._timerUpdate)
    this._timerUpdate = null
    logger.info(`Pause state ${this.name}`)
  }

  /**
   * @param {Object} bot - экземпляр бота
   */
  resume(bot) {
    logger.info(`Resume state ${this.name}`)
  }
}