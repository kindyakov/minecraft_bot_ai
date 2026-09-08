import assert from 'node:assert/strict'
import test from 'node:test'
import { setImmediate as flush } from 'node:timers/promises'

import { ItemFactory, createHarness, registry } from './fixtures/handoffBot'

test('without a usable weapon the bot retreats with real movement, and critical health preempts retreat', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] })
	const { bot, actor, observe, step } = createHarness()
	t.after(() => actor.stop())
	bot.inventory.items = () => [new ItemFactory(registry.itemsByName.bow.id, 1)]
	observe()
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
	assert.equal(bot.attacks.length, 0)
	assert.equal(bot.digCalls.length, 0)
	assert.equal(bot.placeCalls.length, 0)
	actor.send({ type: 'UPDATE_HEALTH', health: 8 })
	assert.ok(
		actor
			.getSnapshot()
			.matches({ MAIN_ACTIVITY: { URGENT_NEEDS: 'EMERGENCY_HEALING' } })
	)
})
