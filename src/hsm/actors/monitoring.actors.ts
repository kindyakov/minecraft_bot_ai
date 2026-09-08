import { createStatefulService } from '@/hsm/helpers/createStatefulService'

import { assessMob, selectCombatTarget } from '@/utils/combat/selfDefense'

const serviceEntitiesTracking = createStatefulService({
	name: 'serviceEntitiesTracking',
	tickInterval: 100,
	asyncTickInterval: 100,

	// Safety facts are published without waiting for attack-route selection.
	onTick: ({ bot, context, sendBack }) => {
		if (!bot.entity?.position || !bot.entities || context.health <= 0) return
		const position = bot.entity.position
		const radius = Math.max(
			context.preferences.maxObservDist,
			context.preferences.safeEatDistance
		)
		const observed = Object.values(bot.entities).filter(
			entity =>
				entity &&
				entity !== bot.entity &&
				entity.isValid !== false &&
				entity.position &&
				position.distanceTo(entity.position) <= radius
		)
		const enemies = observed.filter(
			entity => assessMob(context, entity) !== null
		)
		sendBack({
			type: 'UPDATE_ENTITIES',
			entities: observed.filter(entity => !enemies.includes(entity)),
			enemies,
			players: observed.filter(entity => entity.type === 'player')
		})
	},

	onAsyncTick: ({ getContext, sendBack }) => {
		const context = getContext()
		if (context.health <= 0) return
		sendBack({
			type: 'UPDATE_COMBAT_TARGET',
			combatTarget: selectCombatTarget(context)
		})
	}
})

export default { serviceEntitiesTracking }
