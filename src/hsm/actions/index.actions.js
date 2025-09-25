import entryActions from './entry.js'
import exitActions from './exit.js'
import monitoringActions from './monitoring.js'
import updateActions from './update.js'

export const actions = {
  ...entryActions,
  ...exitActions,
  ...monitoringActions,
  ...updateActions
}