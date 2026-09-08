import assert from 'node:assert/strict'
import test from 'node:test'
import { setImmediate as flush } from 'node:timers/promises'

import { Vec3 } from 'vec3'

import { loadAutoEat } from '@/modules/plugins/autoEat'

import { ItemFactory, createHarness, registry } from './fixtures/handoffBot'

test('a failed hunger attempt stays in recovery while danger is still close', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] })
	const { actor, observe } = createHarness()
	t.after(() => actor.stop())
	actor.send({ type: 'UPDATE_FOOD', food: 5 })
	observe()
	actor.send({ type: 'ERROR', error: 'consume failed' })
	assert.ok(
		actor.getSnapshot().matches({
			MAIN_ACTIVITY: { URGENT_NEEDS: { EMERGENCY_EATING: 'RETRYING' } }
		})
	)
	await flush()
	t.mock.timers.tick(1000)
	await flush()
	assert.ok(
		actor.getSnapshot().matches({
			MAIN_ACTIVITY: { URGENT_NEEDS: { EMERGENCY_EATING: 'RUNNING' } }
		})
	)
})

test('hunger-only recovery leaves safe no-food waiting once, and resumes when food appears', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] })
	const { bot, actor, enemy } = createHarness(true)
	const observe = () => {
		bot.entities = { 1: enemy }
	}
	t.after(() => actor.stop())
	loadAutoEat(bot.asBot())
	bot.food = 5
	actor.send({ type: 'UPDATE_FOOD', food: 5 })
	enemy.position = new Vec3(40, 64, 0)
	observe()
	await flush()
	t.mock.timers.tick(100)
	await flush()
	assert.ok(actor.getSnapshot().matches({ MAIN_ACTIVITY: 'IDLE' }))
	for (let i = 0; i < 5; i++) {
		actor.send({ type: 'UPDATE_FOOD', food: 5 })
		observe()
		t.mock.timers.tick(100)
		await flush()
		assert.ok(actor.getSnapshot().matches({ MAIN_ACTIVITY: 'IDLE' }))
	}
	assert.equal(bot.chatMessages.length, 1)
	const bread = new ItemFactory(registry.itemsByName.bread.id, 1)
	bread.slot = 36
	bot.inventory.items = () => [bread]
	observe()
	await flush()
	t.mock.timers.tick(100)
	await flush()
	t.mock.timers.tick(100)
	await flush()
	assert.equal(bot.usingItem, true)
	actor.send({ type: 'UPDATE_HEALTH', health: 8 })
	actor.send({ type: 'UPDATE_HEALTH', health: 12 })
	actor.send({ type: 'RECOVERY_FAILED', cause: 'no_food', reason: 'no food' })
	assert.ok(
		actor
			.getSnapshot()
			.matches({ MAIN_ACTIVITY: { URGENT_NEEDS: 'EMERGENCY_HEALING' } })
	)
})
