import assert from 'node:assert/strict'
import test from 'node:test'
import { setImmediate as flush } from 'node:timers/promises'

import { Vec3 } from 'vec3'

import { loadHawkeye } from '@/modules/plugins/hawkeye'

import {
	ItemFactory,
	createEntityFixture,
	createHarness,
	registry
} from './fixtures/handoffBot'

test('a swelling creeper outside the selected target interrupts melee and cannot restart melee after defusing', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] })
	const { bot, actor, enemy, step } = createHarness(true)
	t.after(() => actor.stop())
	bot.inventory.items = () => [
		new ItemFactory(registry.itemsByName.iron_sword.id, 1)
	]
	const creeper = createEntityFixture({
		...enemy,
		id: 2,
		name: 'creeper',
		position: new Vec3(3, 64, 0),
		metadata: []
	})
	const keys: string[] = registry.entitiesByName.creeper.metadataKeys
	Object.assign(creeper.metadata, {
		[keys.indexOf('swell_dir')]: -1,
		[keys.indexOf('is_ignited')]: false,
		[keys.indexOf('is_powered')]: false
	})
	bot.entities = { 1: enemy, 2: creeper }
	await flush()
	for (let i = 0; i < 6; i++) {
		t.mock.timers.tick(100)
		await flush()
	}
	assert.equal(bot.pvp.target?.id, 1)
	Object.assign(creeper.metadata, { [keys.indexOf('swell_dir')]: 1 })
	t.mock.timers.tick(100)
	await flush()
	assert.ok(
		actor.getSnapshot().matches({ MAIN_ACTIVITY: { COMBAT: 'RETREATING' } })
	)
	for (let i = 0; i < 20; i++) {
		t.mock.timers.tick(50)
		await flush()
		step()
	}
	assert.ok(bot.entity.position.x < -2)
	Object.assign(creeper.metadata, { [keys.indexOf('swell_dir')]: -1 })
	delete bot.entities[1]
	for (let i = 0; i < 20; i++) {
		t.mock.timers.tick(100)
		await flush()
	}
	assert.equal(bot.pvp.target, undefined)
	assert.ok(!bot.attacks.includes(creeper.id))
	creeper.position = bot.entity.position.offset(35, 0, 0)
	for (let i = 0; i < 4; i++) {
		t.mock.timers.tick(100)
		await flush()
	}
	assert.ok(actor.getSnapshot().matches({ MAIN_ACTIVITY: 'IDLE' }))
	creeper.position = bot.entity.position.offset(2, 0, 0)
	for (let i = 0; i < 8; i++) {
		t.mock.timers.tick(100)
		await flush()
		step()
	}
	assert.equal(bot.pvp.target, undefined)
	assert.ok(!bot.attacks.includes(creeper.id))
})

test('a creeper disengagement can use a real ranged controller without approaching again', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] })
	const { bot, actor, enemy } = createHarness(true)
	t.after(() => actor.stop())
	loadHawkeye(bot.asBot())
	bot.inventory.items = () => [
		new ItemFactory(registry.itemsByName.bow.id, 1),
		new ItemFactory(registry.itemsByName.arrow.id, 16)
	]
	enemy.name = 'creeper'
	const keys: string[] = registry.entitiesByName.creeper.metadataKeys
	Object.assign(enemy.metadata, {
		[keys.indexOf('swell_dir')]: 1,
		[keys.indexOf('is_ignited')]: false,
		[keys.indexOf('is_powered')]: false
	})
	bot.entities = { 1: enemy }
	await flush()
	t.mock.timers.tick(100)
	await flush()
	assert.ok(
		actor.getSnapshot().matches({ MAIN_ACTIVITY: { COMBAT: 'RETREATING' } })
	)
	enemy.position.x = 15
	for (let i = 0; i < 8; i++) {
		t.mock.timers.tick(100)
		await flush()
	}
	assert.ok(
		actor
			.getSnapshot()
			.matches({ MAIN_ACTIVITY: { COMBAT: 'RANGED_SKIRMISHING' } })
	)
	assert.equal(bot.pvp.target, undefined)
})
