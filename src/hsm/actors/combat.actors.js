import { fromCallback } from "xstate"

const serviceCombatMonitoring = fromCallback(({ sendBack }) => {
  console.log('Запустился мониторинг ')

  const interval = setInterval(() => {
    sendBack({ type: 'UPDATE_COMBAT_CONTEXT' })
  }, 250)

  return () => clearInterval(interval) // cleanup
})

export default {
  serviceCombatMonitoring,
}