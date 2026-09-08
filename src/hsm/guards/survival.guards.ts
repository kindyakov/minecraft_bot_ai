import type { MachineContext } from '@/hsm/context'
import type { MachineGuardParams } from '@/hsm/types'

export const hasFreshThreatObservation = (context: MachineContext) =>
	context.threatObservationAt !== null &&
	Date.now() - context.threatObservationAt <=
		context.preferences.threatRetentionMs

export const isRecoveryDistanceSafe = (context: MachineContext) =>
	hasFreshThreatObservation(context) &&
	(!context.nearestThreat ||
		context.nearestThreat.distance >= context.preferences.safeEatDistance)

export const isRecoverySafe = (context: MachineContext) =>
	!context.recoveryRelocation && isRecoveryDistanceSafe(context)

export const canAttemptRecovery = (context: MachineContext) =>
	context.recoveryFailure === null ||
	(context.recoveryFailure === 'no_food' &&
		(context.bot?.utils.getAllFood().length ?? 0) > 0)

export const canPreemptForHungerRecovery = ({
	context,
	event
}: MachineGuardParams) =>
	event.type === 'UPDATE_FOOD' &&
	canAttemptRecovery(context) &&
	event.food < context.preferences.foodEmergency
