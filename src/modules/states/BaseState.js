/**
  * @param {string} stateName - название состояния
 */
export class BaseState {
  constructor(fsm, stateName) {
    this.fsm = fsm
    this.name = stateName
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
}