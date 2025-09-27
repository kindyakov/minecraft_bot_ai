const serviceCombatMonitoring = ({ sendParent }) => {
  const interval = setInterval(() => {
    sendParent({ type: 'UPDATE_COMBAT_CONTEXT' })
  }, 250) // Каждые 100ms

  return () => clearInterval(interval) // Автоматическая очистка при выходе из COMBAT
}

export default {
  serviceCombatMonitoring,
}