import assert from 'node:assert/strict'
import test from 'node:test'

import Logger from '../../config/logger.js'
import { AntiLoopGuard } from '../../hsm/utils/antiLoop.js'

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
