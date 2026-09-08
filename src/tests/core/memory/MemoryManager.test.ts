import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { MemoryManager } from '../../../core/memory/index.js'
import type { MemoryEntryInput } from '../../../core/memory/types.js'

const createTempDataDir = async (): Promise<string> => {
	return fs.mkdtemp(path.join(os.tmpdir(), 'minecraft-bot-memory-'))
}

test('saveEntry upserts same type and position and readEntries filters by tag and distance', async () => {
	const dataDir = await createTempDataDir()
	const manager = new MemoryManager({
		botName: 'TestBot',
		dataDir
	})

	await manager.load()

	const chestInput: MemoryEntryInput = {
		type: 'container',
		position: { x: 10, y: 64, z: 10 },
		tags: ['storage', 'home'],
		description: 'Main base chest',
		data: {
			blockName: 'chest'
		}
	}

	const first = manager.saveEntry(chestInput)
	const second = manager.saveEntry({
		...chestInput,
		description: 'Updated base chest',
		data: {
			blockName: 'chest',
			items: ['oak_log:32']
		}
	})

	assert.equal(first.id, second.id)
	assert.equal(second.description, 'Updated base chest')

	const nearbyStorage = manager.readEntries({
		queryTags: ['storage'],
		origin: { x: 0, y: 64, z: 0 },
		maxDistance: 32
	})

	assert.equal(nearbyStorage.length, 1)
	assert.equal(nearbyStorage[0]?.id, second.id)
	assert.deepEqual(nearbyStorage[0]?.tags, ['storage', 'home'])
})

test('updateEntryData and deleteEntry mutate persisted records', async () => {
	const dataDir = await createTempDataDir()
	const manager = new MemoryManager({
		botName: 'TestBot',
		dataDir
	})

	await manager.load()

	const entry = manager.saveEntry({
		type: 'resource',
		position: { x: 25, y: 12, z: -5 },
		tags: ['wood'],
		description: 'Nearby spruce tree',
		data: {
			blockName: 'spruce_log'
		}
	})

	const updated = manager.updateEntryData(entry.id, {
		blockName: 'spruce_log',
		notes: ['harvested once']
	})

	assert.equal(updated?.id, entry.id)
	assert.deepEqual(updated?.data, {
		blockName: 'spruce_log',
		notes: ['harvested once']
	})

	assert.equal(manager.deleteEntry({ id: entry.id }), true)
	assert.equal(
		manager.readEntries({
			queryTags: ['wood']
		}).length,
		0
	)
})

test('save persists players, task stats and completed goals across restarts', async () => {
	const dataDir = await createTempDataDir()
	const manager = new MemoryManager({
		botName: 'PersistentBot',
		dataDir
	})

	await manager.load()

	manager.rememberPlayer('Steve', { friendly: true })
	manager.rememberTask('mining', true, 120)
	manager.setCurrentGoal({
		goal: 'Mine diamonds',
		priority: 1,
		startedAt: new Date().toISOString(),
		tasks: []
	})
	manager.completeCurrentGoal()
	await manager.save()
	manager.close()

	const restarted = new MemoryManager({
		botName: 'PersistentBot',
		dataDir
	})
	await restarted.load()

	const memory = restarted.getMemory()
	assert.equal(memory.world.knownPlayers['Steve']?.interactions, 1)
	assert.equal(memory.world.knownPlayers['Steve']?.friendly, true)
	assert.equal(memory.experience.tasksCompleted['mining']?.count, 1)
	assert.equal(memory.goals.completed.length, 1)
	assert.equal(memory.goals.completed[0]?.goal, 'Mine diamonds')
	assert.equal(memory.goals.current, undefined)
	restarted.close()
})
