import monitoringEntry from './monitoring.entry.js'
import combatEntry from './combat.entry.js'
import tasksEntry from './tasks.entry.js'
import urgentNeedsEntry from './urgentNeeds.entry.js'
import pefcefulEntry from './pefceful.entry.js'

export default {
  ...monitoringEntry,
  ...combatEntry,
  ...tasksEntry,
  ...urgentNeedsEntry,
  ...pefcefulEntry,
}