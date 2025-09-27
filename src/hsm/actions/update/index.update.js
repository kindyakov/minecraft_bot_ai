import rootUpdate from './root.update.js'
import monitoringUpdate from './monitoring.update.js'
import combatUpdate from './combat.update.js'

export default {
  ...rootUpdate,
  ...monitoringUpdate,
  ...combatUpdate,
}