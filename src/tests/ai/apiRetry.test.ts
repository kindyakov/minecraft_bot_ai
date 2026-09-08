import assert from 'node:assert/strict'
import test from 'node:test'

import {
	isRetryableApiError,
	withApiRetry
} from '../../ai/client/retry.js'

const retryableError = (status: number) => {
	const error = new Error(`Request failed with status ${status}`)
	;(error as unknown as { status: number }).status = status
	return error
}

test('withApiRetry retries retryable failures and returns the success', async () => {
	let calls = 0
	const result = await withApiRetry(
		async () => {
			calls += 1
			if (calls < 3) {
				throw retryableError(429)
			}
			return 'ok'
		},
		{ baseDelayMs: 1 }
	)

	assert.equal(result, 'ok')
	assert.equal(calls, 3)
})

test('withApiRetry does not retry client errors', async () => {
	let calls = 0
	await assert.rejects(
		withApiRetry(
			async () => {
				calls += 1
				throw retryableError(400)
			},
			{ baseDelayMs: 1 }
		),
		/status 400/
	)
	assert.equal(calls, 1)
})

test('withApiRetry gives up after max attempts', async () => {
	let calls = 0
	await assert.rejects(
		withApiRetry(
			async () => {
				calls += 1
				throw retryableError(503)
			},
			{ maxAttempts: 2, baseDelayMs: 1 }
		),
		/status 503/
	)
	assert.equal(calls, 2)
})

test('withApiRetry never retries aborts', async () => {
	const abortError = new Error('The operation was aborted')
	abortError.name = 'AbortError'
	let calls = 0
	await assert.rejects(
		withApiRetry(
			async () => {
				calls += 1
				throw abortError
			},
			{ baseDelayMs: 1 }
		),
		/The operation was aborted/
	)
	assert.equal(calls, 1)
})

test('withApiRetry refuses to start on an aborted signal', async () => {
	const controller = new AbortController()
	controller.abort()
	let calls = 0
	await assert.rejects(
		withApiRetry(
			async () => {
				calls += 1
				return 'ok'
			},
			{ baseDelayMs: 1, signal: controller.signal }
		),
		/Agent request aborted/
	)
	assert.equal(calls, 0)
})

test('isRetryableApiError classifies transport and provider errors', () => {
	assert.equal(isRetryableApiError(retryableError(429)), true)
	assert.equal(isRetryableApiError(retryableError(500)), true)
	assert.equal(isRetryableApiError(retryableError(400)), false)
	assert.equal(
		isRetryableApiError(
			Object.assign(new Error('timeout'), { name: 'APIConnectionTimeoutError' })
		),
		true
	)
	assert.equal(
		isRetryableApiError(Object.assign(new Error('x'), { code: 'ECONNRESET' })),
		true
	)
	assert.equal(isRetryableApiError(new Error('plain')), false)
	assert.equal(isRetryableApiError(null), false)
})
