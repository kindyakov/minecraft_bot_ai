import monitoringGuards from './monitoring.guards.js';
import urgentNeedsGuards from './urgentNeeds.guards.js';
import combatGuards from './combat.guards.js'
import tasksGuards from './tasks.guards.js'
import peacefulGuards from './peaceful.guards.js';

export const guards = {
  ...monitoringGuards,
  ...urgentNeedsGuards,
  ...combatGuards,
  ...tasksGuards,
  ...peacefulGuards,
}
