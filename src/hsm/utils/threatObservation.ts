import { Vec3 } from 'vec3'

import type { Entity } from '@/types'

import type { ThreatObservation } from '@/hsm/context'

/** Keep bounded last-observed positions, never mutable lost Entity references. */
export const observeThreats = (
	previous: ThreatObservation[],
	enemies: Entity[],
	position: Vec3,
	now: number,
	retentionMs: number
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
		byId.set(enemy.id, {
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
