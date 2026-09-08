export interface ApiRetryOptions {
	maxAttempts?: number
	baseDelayMs?: number
	signal?: AbortSignal
}

const DEFAULT_MAX_ATTEMPTS = 3
const DEFAULT_BASE_DELAY_MS = 1000

const RETRYABLE_STATUS_CODES = new Set([
	408, 409, 425, 429, 500, 502, 503, 504
])

const RETRYABLE_ERROR_CODES = new Set([
	'ECONNRESET',
	'ECONNABORTED',
	'ETIMEDOUT',
	'EAI_AGAIN',
	'ENOTFOUND',
	'EPIPE'
])

const RETRYABLE_ERROR_NAMES = new Set([
	'APIConnectionError',
	'APIConnectionTimeoutError',
	'InternalServerError',
	'RateLimitError',
	'BadGatewayError',
	'ServiceUnavailableError',
	'GatewayTimeoutError'
])

export const isRetryableApiError = (error: unknown): boolean => {
	if (!error || typeof error !== 'object') {
		return false
	}

	const record = error as Record<string, unknown>
	if (record.name === 'AbortError') {
		return false
	}

	if (typeof record.status === 'number') {
		return RETRYABLE_STATUS_CODES.has(record.status)
	}

	if (typeof record.code === 'string') {
		return RETRYABLE_ERROR_CODES.has(record.code)
	}

	return typeof record.name === 'string' && RETRYABLE_ERROR_NAMES.has(record.name)
}

const sleep = (delayMs: number, signal?: AbortSignal): Promise<void> =>
	new Promise((resolve, reject) => {
		if (signal?.aborted) {
			reject(new Error('Agent request aborted'))
			return
		}

		const timer = setTimeout(() => {
			signal?.removeEventListener('abort', onAbort)
			resolve()
		}, delayMs)
		const onAbort = () => {
			clearTimeout(timer)
			reject(new Error('Agent request aborted'))
		}
		signal?.addEventListener('abort', onAbort, { once: true })
	})

export const withApiRetry = async <T>(
	action: () => Promise<T>,
	options: ApiRetryOptions = {}
): Promise<T> => {
	const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS
	const baseDelayMs = options.baseDelayMs ?? DEFAULT_BASE_DELAY_MS
	let lastError: unknown = null

	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
		if (options.signal?.aborted) {
			throw new Error('Agent request aborted')
		}

		try {
			return await action()
		} catch (error) {
			lastError = error
			if (attempt >= maxAttempts || !isRetryableApiError(error)) {
				throw error
			}

			await sleep(baseDelayMs * 2 ** (attempt - 1), options.signal)
		}
	}

	throw lastError
}
