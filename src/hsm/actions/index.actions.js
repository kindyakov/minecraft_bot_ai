import entryActions from './entry.js'
import exitActions from './exit.js'
import monitoringActions from './monitoring.js'

export const actions = {
  ...entryActions,
  ...exitActions,
  ...monitoringActions
}