import assert from 'node:assert/strict'
import test from 'node:test'

import { readCreeperSignals, readMobMetadata } from '@/utils/combat/mobSignals'

import {
	HandoffBot,
	createEntityFixture,
	registry
} from './fixtures/handoffBot'

test('creeper decoder uses named keys and keeps swelling, charge and ignition distinct', () => {
	const bot = new HandoffBot()
	bot.registry = {
		...registry,
		entitiesByName: {
			...registry.entitiesByName,
			creeper: { metadataKeys: ['is_ignited', 'is_powered', 'swell_dir'] }
		}
	}
	const entity = createEntityFixture({ name: 'creeper' })
	Object.assign(entity.metadata, { 0: false, 1: true, 2: -1 })
	assert.deepEqual(readCreeperSignals(bot.asBot(), entity), {
		swelling: false,
		powered: true,
		ignited: false
	})
	Object.assign(entity.metadata, { 0: true, 1: false, 2: 1 })
	assert.deepEqual(readCreeperSignals(bot.asBot(), entity), {
		swelling: true,
		powered: false,
		ignited: true
	})
})

test('malformed, missing and unsupported metadata remain unknown, never proof of safety', () => {
	const bot = new HandoffBot()
	const entity = createEntityFixture({ name: 'creeper' })
	const unknown = { swelling: null, powered: null, ignited: null }
	assert.deepEqual(readCreeperSignals(bot.asBot(), entity), unknown)
	for (const key of registry.entitiesByName.creeper.metadataKeys)
		Object.assign(entity.metadata, {
			[registry.entitiesByName.creeper.metadataKeys.indexOf(key)]: 'false'
		})
	assert.deepEqual(readCreeperSignals(bot.asBot(), entity), unknown)
	bot.registry = {
		...registry,
		version: { ...registry.version, minecraftVersion: 'unsupported' }
	}
	Object.assign(entity.metadata, { 16: -1, 17: false, 18: false })
	assert.deepEqual(readCreeperSignals(bot.asBot(), entity), unknown)
	assert.equal(readMobMetadata(bot.asBot(), entity, 'swell_dir'), undefined)
})
