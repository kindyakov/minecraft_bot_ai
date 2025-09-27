import { and, stateIn, } from 'xstate';

const noTasks = and([
  stateIn({ MAIN_ACTIVITY: 'TASKS' }),
  ({ context }) => !context.tasks.length
])

export default {
  noTasks,
}