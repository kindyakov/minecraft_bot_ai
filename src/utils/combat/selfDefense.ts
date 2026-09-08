import type { Entity } from '@/types'

import type { MachineContext } from '@/hsm/context'

import { canSeeEnemy } from './enemyVisibility'
import { vanillaFollowRange } from './mobProfiles'
import { readMobMetadata } from './mobSignals'

export type ThreatKind = 'hostile' | 'uncertain' | 'avoid'

export const assessMob = (
	context: MachineContext,
	entity: Entity
): ThreatKind | null => {
	const bot = context.bot
	if (!bot) return 'uncertain'
	if (entity.type === 'player') return null
	if (['wither', 'ender_dragon', 'warden'].includes(entity.name ?? ''))
		return 'avoid'
	if (bot.registry?.version?.minecraftVersion !== '1.20.4')
		return entity.type === 'hostile' ||
			(entity.name && Object.hasOwn(vanillaFollowRange, entity.name))
			? 'uncertain'
			: null
	if (
		context.lastDamage.sourceId === entity.id &&
		Date.now() - context.lastDamage.observedAt <
			context.preferences.aggressionRetentionMs
	)
		return 'hostile'
	if (entity.name === 'slime') {
		const size = readMobMetadata(bot, entity, 'size')
		return typeof size !== 'number' || !Number.isInteger(size) || size < 1
			? 'uncertain'
			: size === 1
				? null
				: 'hostile'
	}
	if (entity.name === 'spider') {
		if (
			bot.game?.dimension !== 'overworld' &&
			bot.game?.dimension !== 'minecraft:overworld'
		)
			return 'uncertain'
		const block = bot.blockAt(entity.position.offset(0, 0.65, 0))
		// Java 1.20.4 brightness >= 0.5 corresponds to effective light >= 12.
		// Sky darkening/weather are not exposed here: use bounds, not a day/night guess.
		if (
			!block ||
			!Number.isFinite(block.light) ||
			!Number.isFinite(block.skyLight)
		)
			return 'uncertain'
		if (block.light >= 12) return null
		return Math.max(block.light, block.skyLight) < 12 ? 'hostile' : 'uncertain'
	}
	if (entity.name === 'enderman') {
		const angry = readMobMetadata(bot, entity, 'creepy')
		const stared = readMobMetadata(bot, entity, 'stared_at')
		return angry === false && stared === false ? null : 'uncertain'
	}
	return entity.name && Object.hasOwn(vanillaFollowRange, entity.name)
		? 'hostile'
		: entity.type === 'hostile'
			? 'uncertain'
			: null
}

export const requiresAvoidance = (context: MachineContext) =>
	context.threats.some(
		threat =>
			(threat.kind !== 'hostile' &&
				threat.distance <= context.preferences.selfDefenseDistance) ||
			(threat.creeper &&
				(threat.creeper.swelling !== false ||
					threat.creeper.ignited !== false) &&
				threat.distance <= context.preferences.creeperDangerDistance)
	)

export const forbidsMelee = (context: MachineContext) =>
	context.threats.some(
		threat =>
			threat.entityId === context.combatTarget.entity?.id &&
			threat.creeper?.disengaged
	)

export const isDefensiveCandidate = (
	context: MachineContext,
	entity: Entity | null
) => {
	if (
		context.health <= 0 ||
		!context.bot ||
		!entity?.position ||
		entity.isValid === false ||
		assessMob(context, entity) !== 'hostile'
	)
		return false
	const distance = context.bot.entity.position.distanceTo(entity.position)
	const continuingEncounter =
		entity.id === context.combatTarget.entity?.id ||
		context.threats.some(
			threat => threat.entityId === entity.id && threat.creeper?.disengaged
		)
	const range = continuingEncounter
		? context.preferences.maxDistToEnemy
		: Math.min(
				context.preferences.selfDefenseDistance,
				vanillaFollowRange[entity.name ?? ''] ??
					context.preferences.selfDefenseDistance
			)
	return distance <= range && canSeeEnemy(context.bot, entity)
}

export const selectCombatTarget = (
	context: MachineContext
): MachineContext['combatTarget'] => {
	const position = context.bot?.entity?.position
	if (!position) return { entity: null, distance: Infinity }
	const candidates = context.enemies.filter(entity =>
		isDefensiveCandidate(context, entity)
	)
	const immediate = candidates.filter(
		entity =>
			position.distanceTo(entity.position) <=
			context.preferences.enemyMeleeRange
	)
	const pool = immediate.length ? immediate : candidates
	const retained = pool.find(
		entity => entity.id === context.combatTarget.entity?.id
	)
	const entity =
		retained ??
		pool.sort(
			(a, b) =>
				position.distanceTo(a.position) - position.distanceTo(b.position) ||
				a.id - b.id
		)[0] ??
		null
	return {
		entity,
		distance: entity ? position.distanceTo(entity.position) : Infinity
	}
}
