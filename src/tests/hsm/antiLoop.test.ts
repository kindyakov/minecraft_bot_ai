import assert from 'node:assert/strict'
import test from 'node:test'

import Logger from '../../config/logger.js'
import BotStateMachine from '../../core/hsm.js'
import { AntiLoopGuard } from '../../hsm/utils/antiLoop.js'

test('HSM observer resets the guard after its cooldown', t => {
	t.mock.timers.enable({ apis: ['setTimeout'] })
	let observer: (snapshot: unknown) => void = () => {}
	const stops: unknown[] = []
	const wrapper = Object.create(BotStateMachine.prototype) as any
	wrapper.antiLoopGuard = new AntiLoopGuard({
		maxTransitionsPerSecond: 1,
		emergencyStopAfter: 100,
		windowMs: 1000
	})
	wrapper.actor = {
		subscribe(callback: typeof observer) {
			observer = callback
		}
	}
	wrapper.bot = { chat() {} }
	wrapper.send = (event: unknown) => {
		stops.push(event)
	}
	wrapper.setupAntiLoopObserver()
	observer({ value: 'A' })
	observer({ value: 'B' })
	assert.equal(stops.length, 1)
	t.mock.timers.tick(60_000)
	observer({ value: 'IDLE' })
	assert.equal(stops.length, 1)
})

test('AntiLoopGuard ignores repeated updates with the same state signature', () => {
	const guard = new AntiLoopGuard({
		maxTransitionsPerSecond: 2,
		emergencyStopAfter: 100,
		windowMs: 1000
	})

	assert.equal(guard.recordUpdate('TASKS.THINKING'), true)
	assert.equal(guard.recordUpdate('TASKS.THINKING'), true)
	assert.equal(guard.recordUpdate('TASKS.THINKING'), true)

	const stats = guard.getStats()
	assert.equal(stats.loopDetected, false)
	assert.equal(stats.totalUpdates, 1)
	assert.equal(stats.updatesInLastSecond, 1)
})

test('AntiLoopGuard trips on update flood and recovers after reset', () => {
	const originalLoggerError = Logger.error
	Logger.error = () => {}
	try {
		const guard = new AntiLoopGuard({
			maxTransitionsPerSecond: 2,
			emergencyStopAfter: 100,
			windowMs: 60_000
		})

		assert.equal(guard.recordUpdate('STATE_A'), true)
		assert.equal(guard.recordUpdate('STATE_B'), true)
		assert.equal(guard.recordUpdate('STATE_C'), false)

		assert.equal(guard.getStats().loopDetected, true)
		assert.equal(guard.recordUpdate('STATE_D'), false)

		guard.reset()

		assert.equal(guard.getStats().loopDetected, false)
		assert.equal(guard.recordUpdate('STATE_D'), true)
	} finally {
		Logger.error = originalLoggerError
	}
})
