import type { MachineContext } from '@/hsm/context'
import type { MachineEvent } from '@/hsm/types'

/** Simulates both outputs of the observer when observation itself is not under test. */
export const publishEntities = (
	actor: { send: (event: MachineEvent) => void },
	observation: Extract<MachineEvent, { type: 'UPDATE_ENTITIES' }> & {
		combatTarget: MachineContext['combatTarget']
	}
) => {
	const { combatTarget, ...entities } = observation
	actor.send(entities)
	actor.send({ type: 'UPDATE_COMBAT_TARGET', combatTarget })
}
