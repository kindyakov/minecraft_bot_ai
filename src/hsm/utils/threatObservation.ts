import { Vec3 } from 'vec3'

import type { Entity } from '@/types'
import type { Bot } from '@/types'

import type { ThreatObservation } from '@/hsm/context'

import { readCreeperSignals } from '@/utils/combat/mobSignals'
import type { ThreatKind } from '@/utils/combat/selfDefense'

/** Keep bounded last-observed positions, never mutable lost Entity references. */
export const observeThreats = (
	previous: ThreatObservation[],
	enemies: Entity[],
	position: Vec3,
	now: number,
	retentionMs: number,
	assess: (entity: Entity) => ThreatKind | null,
	bot: Bot
) => {
	const byId = new Map<number, ThreatObservation>()
	for (const threat of previous) {
		if (now - threat.lastObservedAt < retentionMs) {
			byId.set(threat.entityId, {
				...threat,
				distance: position.distanceTo(threat.position),
				observed: false
			})
		}
	}
	for (const enemy of enemies) {
		if (!enemy.position || enemy.isValid === false) continue
		const kind = assess(enemy)
		if (!kind) {
			byId.delete(enemy.id)
			continue
		}
		const signals =
			enemy.name === 'creeper' ? readCreeperSignals(bot, enemy) : null
		const creeper = signals
			? {
					...signals,
					disengaged:
						byId.get(enemy.id)?.creeper?.disengaged === true ||
						signals.swelling !== false ||
						signals.ignited !== false
				}
			: null
		byId.set(enemy.id, {
			creeper,
			kind,
			entityId: enemy.id,
			position: new Vec3(enemy.position.x, enemy.position.y, enemy.position.z),
			distance: position.distanceTo(enemy.position),
			lastObservedAt: now,
			observed: true
		})
	}
	const threats = [...byId.values()].sort(
		(a, b) => a.distance - b.distance || a.entityId - b.entityId
	)
	return { threats, nearestThreat: threats[0] ?? null }
}
