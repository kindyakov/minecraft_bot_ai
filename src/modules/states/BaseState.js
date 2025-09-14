/**
  * @param {string} stateName - название состояния
 */
export class BaseState {
  constructor(stateName) {
    this.name = stateName
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
    logger.info(`Exit state ${this.name}`)
  }
}