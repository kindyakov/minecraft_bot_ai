import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { createRequire } from 'node:module'
import test from 'node:test'
import { setImmediate as flush } from 'node:timers/promises'

import pathfinderPackage from 'mineflayer-pathfinder'
import { Vec3 } from 'vec3'
import { createActor, fromPromise } from 'xstate'

import type { Bot, Entity, Item } from '@/types'

import { createBotMachine } from '@/hsm/machine'

import { initAutoEat, loadAutoEat } from '@/modules/plugins/autoEat'
import { loadHawkeye } from '@/modules/plugins/hawkeye'
import { loadMovement } from '@/modules/plugins/movement'
import { loadPvp } from '@/modules/plugins/pvp'

import { BotUtils } from '@/utils/minecraft/botUtils'

const require = createRequire(import.meta.url)
const registry = require('minecraft-data')('1.20.4')
const Block = require('prismarine-block')('1.20.4')
const ItemFactory = require('prismarine-item')('1.20.4')
const { Physics, PlayerState } = require('prismarine-physics')

class HandoffBot extends EventEmitter {
	username = 'HandoffBot'
	version = '1.20.4'
	registry = registry
	entity = {
		id: 999,
		position: new Vec3(0, 64, 0),
		velocity: new Vec3(0, 0, 0),
		height: 1.8,
		onGround: true,
		yaw: 0,
		pitch: 0,
		effects: {}
	}
	entities = {}
	health = 20
	food = 20
	foodSaturation = 5
	oxygenLevel = 20
	game = { dimension: 'overworld', minY: -64 }
	world = { raycast: () => null }
	time = { isDay: true, timeOfDay: 1000 }
	jumpTicks = 0
	jumpQueued = false
	fireworkRocketDuration = 0
	controlState: Record<string, boolean> = {
		forward: false,
		back: false,
		left: false,
		right: false,
		jump: false,
		sprint: false,
		sneak: false
	}
	attacks: number[] = []
	usingItem = false
	itemUses = 0
	_client = new EventEmitter()
	equipGate: Promise<void> = Promise.resolve()
	equippedItems: string[] = []
	aimGate: Promise<void> = Promise.resolve()
	digCalls: Vec3[] = []
	placeCalls: Vec3[] = []
	inventoryClicks: number[] = []
	solidAt = (position: Vec3) => position.y < 64
	physics = Physics(registry, {
		getBlock: (position: Vec3) => this.blockAt(position)
	})
	inventory = Object.assign(new EventEmitter(), {
		slots: Array<Item | null>(46).fill(null),
		selectedItem: null as Item | null,
		firstEmptyInventorySlot: () => null,
		items: (): Item[] => []
	})
	currentWindow = null
	autoEat = {
		isEating: false,
		foodsByName: {},
		opts: { bannedFood: [] },
		findBestChoices: () => []
	}
	hawkEye = { stop() {} }
	utils = new BotUtils(this.asBot())
	declare pvp: Bot['pvp']
	declare pathfinder: Bot['pathfinder']
	declare movements: Bot['movements']
	declare hsm: Bot['hsm']

	asBot() {
		// This fixture replaces the Minecraft server, not the HSM or its actors.
		return this as unknown as Bot
	}
	plugins = new Set<(bot: Bot) => void>()
	loadPlugin(plugin: (bot: Bot) => void) {
		if (this.plugins.has(plugin)) return
		this.plugins.add(plugin)
		plugin(this.asBot())
	}
	hasPlugin(plugin: (bot: Bot) => void) {
		return this.plugins.has(plugin)
	}
	chat() {}
	nearestEntity() {
		return null
	}
	getEquipmentDestSlot(destination: string) {
		return destination === 'off-hand' ? 45 : 36
	}
	supportFeature() {
		return false
	}
	attack(target: Entity) {
		this.attacks.push(target.id)
	}
	activateItem() {
		this.usingItem = true
		this.itemUses++
	}
	deactivateItem() {
		this.usingItem = false
	}
	get heldItem() {
		return this.inventory.slots[36] ?? null
	}
	async equip(item: Item, destination: string) {
		this.equippedItems.push(item.name)
		await this.equipGate
		this.inventory.slots[this.getEquipmentDestSlot(destination)] = item
	}
	async dig(block: { position: Vec3 }) {
		this.digCalls.push(block.position)
	}
	async placeBlock(block: { position: Vec3 }) {
		this.placeCalls.push(block.position)
	}
	async clickWindow(slot: number) {
		this.inventoryClicks.push(slot)
	}
	stopDigging() {
		this.emit('diggingAborted')
	}
	setControlState(control: string, active: boolean) {
		this.controlState[control] = active
	}
	clearControlStates() {
		for (const key of Object.keys(this.controlState))
			this.controlState[key] = false
	}
	async look(yaw: number, pitch: number) {
		this.entity.yaw = yaw
		this.entity.pitch = pitch
	}
	async lookAt(position: Vec3) {
		const delta = position.minus(this.entity.position)
		await this.look(Math.atan2(-delta.x, -delta.z), 0)
		await this.aimGate
	}
	blockAt(position: Vec3) {
		const block = Block.fromStateId(
			(this.solidAt(position)
				? registry.blocksByName.stone
				: registry.blocksByName.air
			).minStateId,
			0
		)
		block.position = position.floored()
		return block
	}
}

const createHarness = () => {
	const bot = new HandoffBot()
	bot.loadPlugin(pathfinderPackage.pathfinder)
	loadPvp(bot.asBot())
	loadMovement(bot.asBot())
	bot.movements = new pathfinderPackage.Movements(bot.asBot())
	bot.pvp.movements = bot.movements
	bot.pathfinder.setMovements(bot.movements)
	const actor = createActor(
		createBotMachine({
			actors: { serviceEntitiesTracking: fromPromise(async () => {}) }
		}),
		{ input: { bot: bot.asBot() } }
	)
	bot.hsm = { getContext: () => actor.getSnapshot().context } as Bot['hsm']
	actor.start()
	const enemy = {
		id: 1,
		type: 'hostile',
		name: 'zombie',
		height: 1.8,
		position: new Vec3(2, 64, 0),
		isValid: true,
		metadata: []
	} as unknown as Entity
	const observe = () =>
		actor.send({
			type: 'UPDATE_ENTITIES',
			entities: [enemy],
			enemies: [enemy],
			players: [],
			nearestEnemy: {
				entity: enemy,
				distance: bot.entity.position.distanceTo(enemy.position)
			}
		})
	const world = { getBlock: bot.blockAt.bind(bot) }
	const physics = Physics(registry, world)
	const step = () => {
		bot.emit('physicsTick')
		bot.emit('physicTick')
		physics
			.simulatePlayer(new PlayerState(bot, bot.controlState), world)
			.apply(bot)
		observe()
	}
	return { bot, actor, enemy, observe, step }
}

test('canceling an unfinished melee start cannot reacquire movement from survival', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] })
	const { bot, actor, enemy, observe, step } = createHarness()
	t.after(() => actor.stop())
	observe()
	await flush()
	// The real melee actor starts PVP, whose stop/attack handoff yields a microtask.
	t.mock.timers.tick(500)
	actor.send({ type: 'UPDATE_HEALTH', health: 8 })
	await flush()
	t.mock.timers.tick(100)
	await flush()
	const before = bot.entity.position.distanceTo(enemy.position)
	for (let tick = 0; tick < 20; tick++) {
		step()
		await flush()
	}
	assert.equal(
		bot.pvp.target,
		undefined,
		'Canceled PVP must not reacquire its target'
	)
	assert.deepEqual(bot.attacks, [], 'No attack may escape the canceled actor')
	assert.ok(
		bot.entity.position.distanceTo(enemy.position) > before + 2,
		'Survival must keep moving away over multiple physics ticks'
	)
})

test('an old PVP path-stop timeout cannot clear the escape route or other listeners', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] })
	const { bot, actor, enemy, observe } = createHarness()
	t.after(() => actor.stop())
	enemy.position.x = 18
	observe()
	await flush()
	t.mock.timers.tick(500)
	await flush()
	bot.emit('entityGone', enemy)
	const unrelatedListener = () => {}
	bot.on('path_stop', unrelatedListener)
	actor.send({ type: 'UPDATE_HEALTH', health: 8 })
	await flush()
	t.mock.timers.tick(100)
	await flush()
	assert.ok(bot.pathfinder.goal, 'Survival has issued its escape route')
	t.mock.timers.tick(5000)
	await flush()
	assert.ok(
		bot.pathfinder.goal,
		'Late combat cleanup must not clear the escape route'
	)
	assert.ok(
		bot.listeners('path_stop').includes(unrelatedListener),
		'Combat must not remove another subscriber'
	)
})

test('survival releases the shield raised by autonomous creeper defense', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] })
	const { bot, actor, enemy, observe, step } = createHarness()
	t.after(() => actor.stop())
	bot.inventory.slots[45] = new ItemFactory(registry.itemsByName.shield.id, 1)
	Object.assign(enemy, { name: 'creeper', metadata: [...Array(16).fill(0), 1] })
	observe()
	await flush()
	t.mock.timers.tick(500)
	await flush()
	step()
	assert.equal(bot.usingItem, true, 'The real PVP plugin raised the shield')
	actor.send({ type: 'UPDATE_HEALTH', health: 8 })
	await flush()
	t.mock.timers.tick(100)
	await flush()
	assert.equal(
		bot.usingItem,
		false,
		'Combat must release item use before escape'
	)
	const before = bot.entity.position.distanceTo(enemy.position)
	for (let tick = 0; tick < 20; tick++) {
		step()
		await flush()
	}
	assert.ok(bot.entity.position.distanceTo(enemy.position) > before + 2)
})

test('canceling food during equip cannot start eating after escape begins', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] })
	const { bot, actor, enemy, observe, step } = createHarness()
	t.after(() => actor.stop())
	loadAutoEat(bot.asBot())
	const bread: Item = new ItemFactory(registry.itemsByName.bread.id, 1)
	bread.slot = 36
	bot.inventory.items = () => [bread]
	let finishEquip = () => {}
	bot.equipGate = new Promise<void>(resolve => {
		finishEquip = resolve
	})
	bot.food = 8
	actor.send({ type: 'UPDATE_FOOD', food: 8 })
	actor.send({ type: 'UPDATE_HEALTH', health: 8 })
	await flush()
	t.mock.timers.tick(100)
	await flush()
	assert.equal(bot.asBot().autoEat.isEating, true)
	observe()
	t.mock.timers.tick(100)
	await flush()
	const before = bot.entity.position.distanceTo(enemy.position)
	finishEquip()
	await flush()
	assert.equal(
		bot.itemUses,
		0,
		'Canceled equip must not continue into food activation'
	)
	for (let tick = 0; tick < 20; tick++) {
		step()
		await flush()
	}
	assert.ok(bot.entity.position.distanceTo(enemy.position) > before + 2)
	assert.equal(bot.asBot().autoEat.isEating, false)
	assert.equal(bot._client.listenerCount('entity_status'), 0)
})

test('a ranged physics callback queued before preemption cannot reactivate item use', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] })
	const { bot, actor, enemy, observe } = createHarness()
	t.after(() => actor.stop())
	loadHawkeye(bot.asBot())
	bot.inventory.items = () => [
		new ItemFactory(registry.itemsByName.bow.id, 1),
		new ItemFactory(registry.itemsByName.arrow.id, 16)
	]
	enemy.position.x = 12
	// A health packet arrives during a tick whose listener list already includes ranged combat.
	bot.once('physicsTick', () =>
		actor.send({ type: 'UPDATE_HEALTH', health: 8 })
	)
	observe()
	await flush()
	t.mock.timers.tick(250)
	await flush()
	assert.ok(
		actor
			.getSnapshot()
			.matches({ MAIN_ACTIVITY: { COMBAT: 'RANGED_SKIRMISHING' } })
	)
	bot.emit('physicsTick')
	await flush()
	assert.equal(
		bot.itemUses,
		0,
		'An already queued ranged callback must respect stop'
	)
	assert.equal(bot.usingItem, false)
})

test('a canceled food equip rejection cannot perform late inventory recovery', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] })
	const { bot, actor, observe } = createHarness()
	t.after(() => actor.stop())
	loadAutoEat(bot.asBot())
	initAutoEat(bot.asBot())
	const bread: Item = new ItemFactory(registry.itemsByName.bread.id, 1)
	bread.slot = 36
	bot.inventory.items = () => [bread]
	bot.inventory.selectedItem = bread
	let rejectEquip = (_error: Error) => {}
	bot.equipGate = new Promise<void>((_resolve, reject) => {
		rejectEquip = reject
	})
	bot.food = 8
	actor.send({ type: 'UPDATE_FOOD', food: 8 })
	actor.send({ type: 'UPDATE_HEALTH', health: 8 })
	await flush()
	t.mock.timers.tick(100)
	await flush()
	assert.equal(bot.asBot().autoEat.isEating, true)
	observe()
	t.mock.timers.tick(100)
	await flush()
	rejectEquip(new Error('Server rejected old equip'))
	await flush()
	assert.deepEqual(
		bot.inventoryClicks,
		[],
		'Canceled food cannot click or drop the inventory cursor'
	)
	assert.equal(bot.itemUses, 0)
	assert.equal(bot.asBot().autoEat.isEating, false)
})

test('a pathfinder equip completing after preemption cannot start old digging', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] })
	const { bot, actor, enemy, observe } = createHarness()
	t.after(() => actor.stop())
	bot.solidAt = position =>
		position.y < 64 || (Math.floor(position.x) === 1 && position.y < 67)
	bot.inventory.items = () => [
		new ItemFactory(registry.itemsByName.iron_pickaxe.id, 1)
	]
	enemy.position.x = 5
	let finishEquip = () => {}
	bot.equipGate = new Promise<void>(resolve => {
		finishEquip = resolve
	})
	observe()
	await flush()
	t.mock.timers.tick(500)
	await flush()
	bot.emit('physicsTick')
	await flush()
	assert.ok(
		bot.equippedItems.includes('iron_pickaxe'),
		'The real pathfinder is waiting to equip for digging'
	)
	const otherDiggingListener = () => {}
	bot.on('diggingAborted', otherDiggingListener)
	actor.send({ type: 'UPDATE_HEALTH', health: 8 })
	await flush()
	t.mock.timers.tick(100)
	await flush()
	finishEquip()
	await flush()
	assert.deepEqual(
		bot.digCalls,
		[],
		'A canceled route must not start digging after its equip resolves'
	)
	assert.ok(
		bot.listeners('diggingAborted').includes(otherDiggingListener),
		'Canceling a route must preserve unrelated digging subscribers'
	)
	assert.equal(bot.controlState.forward, true)
})

test('a pathfinder placement equip cannot continue on a canceled route', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] })
	const { bot, actor, enemy, observe } = createHarness()
	t.after(() => actor.stop())
	bot.solidAt = position => position.y < 64 && Math.floor(position.x) !== 1
	bot.movements.allowParkour = false
	bot.movements.canDig = false
	Object.assign(bot.pathfinder, { LOSWhenPlacingBlocks: false })
	bot.inventory.items = () => [
		new ItemFactory(registry.itemsByName.cobblestone.id, 16)
	]
	enemy.position.x = 5
	let finishEquip = () => {}
	bot.equipGate = new Promise<void>(resolve => {
		finishEquip = resolve
	})
	observe()
	await flush()
	t.mock.timers.tick(500)
	await flush()
	bot.emit('physicsTick')
	await flush()
	assert.ok(
		bot.equippedItems.includes('cobblestone'),
		'The route is waiting for a building item'
	)
	actor.send({ type: 'UPDATE_HEALTH', health: 8 })
	await flush()
	t.mock.timers.tick(100)
	await flush()
	finishEquip()
	await flush()
	assert.deepEqual(bot.placeCalls, [], 'Canceled route must not place a block')
})

for (const ending of ['death', 'stop'] as const) {
	test(`${ending} cancels an aimed attack, including reuse of the same target after death`, async t => {
		t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] })
		const { bot, actor, observe } = createHarness()
		t.after(() => actor.stop())
		let finishAim = () => {}
		bot.aimGate = new Promise<void>(resolve => {
			finishAim = resolve
		})
		observe()
		await flush()
		t.mock.timers.tick(500)
		await flush()
		bot.emit('physicTick')
		await flush()
		assert.deepEqual(
			bot.attacks,
			[],
			'The attack is waiting for aim completion'
		)
		if (ending === 'stop') actor.stop()
		else {
			actor.send({ type: 'DEATH' })
			actor.send({ type: 'UPDATE_HEALTH', health: 20 })
			observe()
			await flush()
			t.mock.timers.tick(500)
			await flush()
		}
		finishAim()
		await flush()
		assert.deepEqual(
			bot.attacks,
			[],
			'Completion from the old invocation must not attack'
		)
		if (ending === 'death') {
			bot.emit('physicTick')
			await flush()
			assert.deepEqual(
				bot.attacks,
				[1],
				'A fresh invocation can still attack normally'
			)
		}
		actor.stop()
		t.mock.timers.tick(6000)
		await flush()
		assert.equal(bot.pvp.target, undefined)
		assert.equal(bot.usingItem, false)
	})

	test(`${ending} cancels active food without restoring the previous owner's item`, async t => {
		t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] })
		const { bot, actor } = createHarness()
		t.after(() => actor.stop())
		loadAutoEat(bot.asBot())
		const bread: Item = new ItemFactory(registry.itemsByName.bread.id, 1)
		bread.slot = 36
		bot.inventory.items = () => [bread]
		bot.inventory.slots[36] = new ItemFactory(
			registry.itemsByName.wooden_sword.id,
			1
		)
		bot.food = 8
		actor.send({ type: 'UPDATE_FOOD', food: 8 })
		actor.send({ type: 'UPDATE_HEALTH', health: 8 })
		await flush()
		t.mock.timers.tick(100)
		await flush()
		assert.equal(bot.usingItem, true)
		if (ending === 'stop') actor.stop()
		else actor.send({ type: 'DEATH' })
		await flush()
		t.mock.timers.tick(10_000)
		await flush()
		assert.deepEqual(
			bot.equippedItems,
			['bread'],
			'Canceled food must not re-equip the old sword'
		)
		assert.equal(bot.usingItem, false)
		assert.equal(bot.asBot().autoEat.isEating, false)
		assert.equal(bot._client.listenerCount('entity_status'), 0)
		assert.equal(bot.inventory.listenerCount('updateSlot'), 0)
	})
}

test('food success clears its observers and allows another eating attempt', async t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] })
	const { bot, actor } = createHarness()
	t.after(() => actor.stop())
	loadAutoEat(bot.asBot())
	const bread: Item = new ItemFactory(registry.itemsByName.bread.id, 2)
	bread.slot = 36
	bot.inventory.items = () => [bread]
	bot.food = 8
	actor.send({ type: 'UPDATE_FOOD', food: 8 })
	actor.send({ type: 'UPDATE_HEALTH', health: 8 })
	await flush()
	for (let attempt = 1; attempt <= 2; attempt++) {
		t.mock.timers.tick(100)
		await flush()
		assert.equal(bot.itemUses, attempt)
		bot._client.emit('entity_status', {
			entityId: bot.entity.id,
			entityStatus: 9
		})
		bot.usingItem = false // The simulated server finished consuming.
		await flush()
		assert.equal(bot.asBot().autoEat.isEating, false)
		assert.equal(bot._client.listenerCount('entity_status'), 0)
		assert.equal(bot.inventory.listenerCount('updateSlot'), 0)
	}
})
