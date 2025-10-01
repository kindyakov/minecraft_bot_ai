import { fromCallback } from "xstate"

const serviceCombatMonitoring = fromCallback(({ sendBack, input }) => {
  const interval = setInterval(() => {
    sendBack({ type: 'ANALYZE_COMBAT' })
  }, 500)

  return () => clearInterval(interval)
})

export default {
  serviceCombatMonitoring,
}