import entryActions from './entry/index.entry.js'
import exitActions from './exit/index.exit.js'
import saveActions from './save/index.save.js'
import updateActions from './update/index.update.js'

export const actions = {
  ...entryActions,
  ...exitActions,
  ...saveActions,
  ...updateActions,
}