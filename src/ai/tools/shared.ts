import type { InspectBlocksScope } from '@/ai/runtime/inspect.js'
import { Vec3 as Vec3Class } from 'vec3'

import type { Bot } from '@/types'

import type { MemoryManager } from '@/core/memory/index.js'
import type {
	JsonValue,
	MemoryEntryType,
	MemoryPosition
} from '@/core/memory/types.js'

export const positionSchema = {
	type: 'object',
	additionalProperties: false,
	properties: {
		x: { type: 'number' },
		y: { type: 'number' },
		z: { type: 'number' }
	},
	required: ['x', 'y', 'z']
} satisfies Record<string, unknown>

export const vectorSchema = {
	type: 'object',
	additionalProperties: false,
	properties: {
		x: { type: 'number' },
		y: { type: 'number' },
		z: { type: 'number' }
	},
	required: ['x', 'y', 'z']
} satisfies Record<string, unknown>

export const getMemory = (bot: Bot): MemoryManager => bot.memory

export const isRecord = (value: unknown): value is Record<string, unknown> =>
	Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const isJsonValue = (value: unknown): value is JsonValue => {
	if (value === null) {
		return true
	}

	switch (typeof value) {
		case 'string':
		case 'number':
		case 'boolean':
			return true
		case 'object':
			return Array.isArray(value)
				? value.every(isJsonValue)
				: Object.values(value as Record<string, unknown>).every(isJsonValue)
		default:
			return false
	}
}

export const toJsonRecord = (value: unknown): Record<string, JsonValue> => {
	if (!isRecord(value)) {
		return {}
	}

	const entries = Object.entries(value).filter((entry): entry is [
		string,
		JsonValue
	] => isJsonValue(entry[1]))
	return Object.fromEntries(entries)
}

export const tryToPosition = (value: unknown): MemoryPosition | null => {
	if (!isRecord(value)) {
		return null
	}

	const x = Number(value.x)
	const y = Number(value.y)
	const z = Number(value.z)
	if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
		return null
	}

	return {
		x,
		y,
		z
	}
}

export const toVec3 = (position: MemoryPosition) =>
	new Vec3Class(position.x, position.y, position.z)

export const positionsEqual = (
	left: MemoryPosition | null | undefined,
	right: MemoryPosition | null | undefined
): boolean =>
	Boolean(
		left &&
		right &&
		left.x === right.x &&
		left.y === right.y &&
		left.z === right.z
	)

export const toBlocksScope = (value: unknown): InspectBlocksScope => {
	if (value === 'interactables' || value === 'resources' || value === 'all') {
		return value
	}

	return 'all'
}

export const MEMORY_ENTRY_TYPES: MemoryEntryType[] = [
	'container',
	'location',
	'resource',
	'danger'
]

export const toMemoryEntryType = (value: unknown): MemoryEntryType | null =>
	typeof value === 'string' &&
	(MEMORY_ENTRY_TYPES as string[]).includes(value)
		? (value as MemoryEntryType)
		: null
