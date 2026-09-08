import type { Entity } from '@/types'

import { createStatefulService } from '@/hsm/helpers/createStatefulService'
import { isEntityOfType } from '@/hsm/utils/isEntityOfType'

import { canAttackEnemy } from '@/utils/combat/enemyVisibility'

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
		sendBack({
			type: 'UPDATE_ENTITIES',
			entities: observed.filter(entity => !isEntityOfType(entity)),
			enemies: observed.filter(entity => isEntityOfType(entity)),
			players: observed.filter(entity => entity.type === 'player')
		})
	},

	onAsyncTick: async ({ bot, getContext, sendBack, abortSignal }) => {
		const context = getContext()
		if (!bot.entity?.position || context.health <= 0) return
		const candidates = context.enemies
			.filter(
				enemy =>
					bot.entity.position.distanceTo(enemy.position) <=
					context.preferences.maxDistToEnemy
			)
			.sort(
				(a, b) =>
					bot.entity.position.distanceTo(a.position) -
					bot.entity.position.distanceTo(b.position)
			)
		let target: Entity | null = null
		for (const enemy of candidates) {
			if (abortSignal.aborted) return
			const canAttack = await canAttackEnemy(
				bot,
				enemy,
				context.preferences.maxDistToEnemy,
				context.preferences.maxDistToEnemy *
					context.preferences.maxPathLengthMultiplier,
				context.preferences.pathfindTimeout,
				context.isActiveTask
			)
			if (abortSignal.aborted || getContext().health <= 0) return
			if (
				canAttack &&
				enemy.isValid !== false &&
				getContext().enemies.includes(enemy) &&
				bot.entity.position.distanceTo(enemy.position) <=
					getContext().preferences.maxDistToEnemy
			) {
				target = enemy
				break
			}
		}
		sendBack({
			type: 'UPDATE_COMBAT_TARGET',
			combatTarget: {
				entity: target,
				distance: target
					? bot.entity.position.distanceTo(target.position)
					: Infinity
			}
		})
	}
})

export default { serviceEntitiesTracking }
