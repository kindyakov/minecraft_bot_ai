import assert from 'node:assert/strict'
import test from 'node:test'
import { setImmediate as flush } from 'node:timers/promises'

import { ItemFactory, createHarness, registry } from './fixtures/handoffBot'

test('unsupported-version slime remains an uncertain threat rather than disappearing', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] })
	const { bot, actor, enemy } = createHarness(true)
	t.after(() => actor.stop())
	bot.registry = {
		...registry,
		version: { ...registry.version, minecraftVersion: 'unsupported' }
	}
	enemy.name = 'slime'
	enemy.type = registry.entitiesByName.slime.type
	bot.entities = { 1: enemy }
	await flush()
	for (let i = 0; i < 6; i++) {
		t.mock.timers.tick(100)
		await flush()
	}
	assert.equal(actor.getSnapshot().context.nearestThreat?.kind, 'uncertain')
	assert.equal(bot.attacks.length, 0)
})

for (const name of ['slime', 'ender_dragon']) {
	test(`real registry classification for ${name} reaches the shared threat observer`, async t => {
		t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] })
		const { bot, actor, enemy } = createHarness(true)
		t.after(() => actor.stop())
		enemy.name = name
		enemy.type = registry.entitiesByName[name].type
		if (name === 'slime')
			Object.assign(enemy.metadata, {
				[registry.entitiesByName.slime.metadataKeys.indexOf('size')]: 2
			})
		bot.entities = { 1: enemy }
		await flush()
		for (let i = 0; i < 6; i++) {
			t.mock.timers.tick(100)
			await flush()
		}
		assert.equal(actor.getSnapshot().context.nearestThreat?.entityId, enemy.id)
		assert.equal(
			actor.getSnapshot().context.nearestThreat?.kind,
			name === 'slime' ? 'hostile' : 'avoid'
		)
	})
}

test('a tiny slime cannot cause damage and is not attacked preemptively', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] })
	const { bot, actor, enemy, step } = createHarness(true)
	t.after(() => actor.stop())
	bot.inventory.items = () => [
		new ItemFactory(registry.itemsByName.iron_sword.id, 1)
	]
	enemy.name = 'slime'
	Object.assign(enemy.metadata, {
		[registry.entitiesByName.slime.metadataKeys.indexOf('size')]: 1
	})
	bot.entities = { 1: enemy }
	await flush()
	for (let i = 0; i < 20; i++) {
		t.mock.timers.tick(50)
		await flush()
		step()
	}
	assert.equal(bot.attacks.length, 0)
})

test('an unknown hostile species is uncertainty, not automatic permission to attack', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] })
	const { bot, actor, enemy, step } = createHarness(true)
	t.after(() => actor.stop())
	bot.inventory.items = () => [
		new ItemFactory(registry.itemsByName.iron_sword.id, 1)
	]
	enemy.name = 'unknown_modded_monster'
	bot.entities = { 1: enemy }
	await flush()
	for (let i = 0; i < 20; i++) {
		t.mock.timers.tick(50)
		await flush()
		step()
	}
	assert.equal(bot.attacks.length, 0)
	assert.ok(bot.entity.position.x < -2)
})

test('immediate danger replaces a distant held target but equal threats do not ping-pong', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] })
	const { bot, actor, enemy } = createHarness(true)
	t.after(() => actor.stop())
	bot.inventory.items = () => [
		new ItemFactory(registry.itemsByName.iron_sword.id, 1)
	]
	bot.entities = { 1: enemy }
	await flush()
	for (let i = 0; i < 6; i++) {
		t.mock.timers.tick(100)
		await flush()
	}
	assert.equal(bot.pvp.target?.id, 1)
	enemy.position.x = 10
	const close = {
		...enemy,
		id: 2,
		position: enemy.position.offset(-8, 0, 0)
	} as typeof enemy
	bot.entities[2] = close
	for (let i = 0; i < 6; i++) {
		t.mock.timers.tick(100)
		await flush()
	}
	assert.equal(bot.pvp.target?.id, 2)
	enemy.position.x = 1.9
	for (let i = 0; i < 6; i++) {
		t.mock.timers.tick(100)
		await flush()
	}
	assert.equal(bot.pvp.target?.id, 2)
})

test('a confirmed attack on the bot permits self-defense against an enderman', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] })
	const { bot, actor, enemy, step } = createHarness(true)
	t.after(() => actor.stop())
	bot.inventory.items = () => [
		new ItemFactory(registry.itemsByName.iron_sword.id, 1)
	]
	enemy.name = 'enderman'
	bot.entities = { 1: enemy }
	bot.emit('entityHurt', bot.entity, enemy)
	await flush()
	for (let i = 0; i < 20; i++) {
		t.mock.timers.tick(50)
		await flush()
		step()
	}
	assert.ok(bot.attacks.includes(enemy.id))
})

test('an avoid-only boss makes an armed bot retreat instead of attacking', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] })
	const { bot, actor, enemy, step } = createHarness(true)
	t.after(() => actor.stop())
	bot.inventory.items = () => [
		new ItemFactory(registry.itemsByName.iron_sword.id, 1)
	]
	enemy.name = 'warden'
	bot.entities = { 1: enemy }
	await flush()
	for (let i = 0; i < 20; i++) {
		t.mock.timers.tick(50)
		await flush()
		step()
	}
	assert.equal(bot.attacks.length, 0)
	assert.ok(bot.entity.position.x < -2)
})

test('distant detection does not initiate pursuit and player attack commands are rejected', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] })
	const { bot, actor, enemy } = createHarness(true)
	t.after(() => actor.stop())
	bot.inventory.items = () => [
		new ItemFactory(registry.itemsByName.iron_sword.id, 1)
	]
	enemy.position.x = 18
	bot.entities = { 1: enemy }
	await flush()
	for (let i = 0; i < 8; i++) {
		t.mock.timers.tick(100)
		await flush()
	}
	assert.equal(bot.pvp.target, undefined)
	assert.ok(actor.getSnapshot().matches({ MAIN_ACTIVITY: 'IDLE' }))
	const player = {
		...enemy,
		id: 2,
		type: 'player',
		name: 'player'
	} as typeof enemy
	actor.send({ type: 'START_COMBAT', target: player })
	await flush()
	t.mock.timers.tick(500)
	await flush()
	assert.equal(bot.pvp.target, undefined)
})

test('bright block light prevents a first attack on a spider even at night', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] })
	const { bot, actor, enemy, step } = createHarness(true)
	t.after(() => actor.stop())
	bot.inventory.items = () => [
		new ItemFactory(registry.itemsByName.iron_sword.id, 1)
	]
	enemy.name = 'spider'
	bot.time = { isDay: false, timeOfDay: 18000 }
	const blockAt = bot.blockAt.bind(bot)
	bot.blockAt = position => {
		const block = blockAt(position)
		block.light = 15
		block.skyLight = 0
		return block
	}
	bot.entities = { 1: enemy }
	await flush()
	for (let i = 0; i < 20; i++) {
		t.mock.timers.tick(50)
		await flush()
		step()
	}
	assert.equal(bot.attacks.length, 0)
	assert.equal(bot.pvp.target, undefined)
})

test('an unprovoked enderman does not become an attack target merely by being close', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] })
	const { bot, actor, enemy, step } = createHarness(true)
	t.after(() => actor.stop())
	bot.inventory.items = () => [
		new ItemFactory(registry.itemsByName.iron_sword.id, 1)
	]
	enemy.name = 'enderman'
	bot.entities = { 1: enemy }
	await flush()
	for (let i = 0; i < 30; i++) {
		t.mock.timers.tick(50)
		await flush()
		step()
	}
	assert.equal(bot.attacks.length, 0)
	assert.equal(bot.pvp.target, undefined)
	assert.ok(
		bot.entity.position.x < -2,
		'Unknown provocation calls for distance, not an attack'
	)
})
