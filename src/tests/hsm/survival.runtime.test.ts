import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { createRequire } from 'node:module'
import test from 'node:test'
import { setTimeout as delay } from 'node:timers/promises'

import { Vec3 } from 'vec3'
import { createActor, fromPromise } from 'xstate'

import { createBotMachine } from '../../hsm/machine.js'
import { publishEntities } from './fixtures/publishEntities'

const hangingActor = fromPromise(async () => {
	return await new Promise<never>(() => {})
})

const noopActor = fromPromise(async () => {})

test('real movement and physics increase separation in every flee direction', async () => {
	const require = createRequire(import.meta.url)
	const data = require('minecraft-data')('1.20.4')
	const Block = require('prismarine-block')('1.20.4')
	const { Physics, PlayerState } = require('prismarine-physics')
	const movement = require('mineflayer-movement')
	const world = {
		getBlock(position: Vec3) {
			const block = Block.fromStateId(
				(position.y < 64 ? data.blocksByName.stone : data.blocksByName.air)
					.minStateId,
				0
			)
			block.position = position.floored()
			return block
		}
	}
	for (const useMovement of [true, false]) {
		for (const [x, z] of [
			[1.5, 0],
			[-1.5, 0],
			[0, 1.5],
			[0, -1.5]
		]) {
			const bot = new SurvivalBot() as any
			Object.assign(bot.entity, {
				velocity: new Vec3(0, 0, 0),
				onGround: true,
				yaw: 0,
				pitch: 0,
				effects: []
			})
			bot.version = '1.20.4'
			bot.jumpTicks = 0
			bot.jumpQueued = false
			bot.fireworkRocketDuration = 0
			bot.blockAt = world.getBlock
			bot.look = async (yaw: number, pitch: number) => {
				bot.entity.yaw = yaw
				bot.entity.pitch = pitch
			}
			movement.plugin(bot)
			let yawSelections = 0
			const getYaw = bot.movement.getYaw.bind(bot.movement)
			bot.movement.getYaw = (...args: any[]) => {
				yawSelections++
				return getYaw(...args)
			}
			if (!useMovement) bot.movement = undefined
			const actor = createSurvivalActor(bot)
			try {
				const enemy = { ...createEnemy(1.5), position: new Vec3(x!, 64, z!) }
				await enterUrgentHealing(actor, enemy)
				const controls = Object.fromEntries(bot.controlStates)
				const before = bot.entity.position.distanceTo(enemy.position)
				Physics(data, world)
					.simulatePlayer(new PlayerState(bot, controls), world)
					.apply(bot)
				assert.ok(
					bot.entity.position.distanceTo(enemy.position) > before,
					`Flee must increase distance for enemy ${x},${z}`
				)
				if (useMovement)
					assert.ok(
						yawSelections > 0,
						'Terrain heuristics must participate in steering'
					)
			} finally {
				actor.stop()
			}
		}
	}
})

test('unavailable food releases the task and does not restart recovery on unchanged hunger', async () => {
	const bot = new SurvivalBot()
	bot.utils.getAllFood = () => []
	const actor = createSurvivalActor(bot)
	try {
		actor.send({
			type: 'USER_COMMAND',
			username: 'Steve',
			text: 'Collect food'
		})
		actor.send({ type: 'UPDATE_FOOD', food: 5 })
		await delay(200)
		assert.ok(
			actor.getSnapshot().matches({ MAIN_ACTIVITY: { TASKS: 'THINKING' } })
		)
		actor.send({ type: 'UPDATE_FOOD', food: 5 })
		assert.ok(
			actor.getSnapshot().matches({ MAIN_ACTIVITY: { TASKS: 'THINKING' } })
		)
		assert.equal(bot.eatingCalls, 0)
		bot.utils.getAllFood = () => [{ name: 'bread' }]
		actor.send({ type: 'UPDATE_FOOD', food: 5 })
		assert.ok(
			actor
				.getSnapshot()
				.matches({ MAIN_ACTIVITY: { URGENT_NEEDS: 'EMERGENCY_EATING' } })
		)
	} finally {
		actor.stop()
	}
})

test('an unfinished eating call does not delay fleeing from a new threat', async () => {
	const bot = new SurvivalBot()
	bot.utils.eating = () => new Promise<void>(() => {})
	const actor = createSurvivalActor(bot)
	try {
		actor.send({ type: 'UPDATE_HEALTH', health: 8 })
		await delay(150)
		const enemy = createEnemy(2)
		publishEntities(actor, {
			type: 'UPDATE_ENTITIES',
			entities: [enemy] as any,
			enemies: [enemy] as any,
			players: [],
			combatTarget: { entity: enemy as any, distance: 2 }
		})
		await delay(150)
		assert.equal(actor.getSnapshot().context.movementOwner, 'MOVEMENT')
		assert.equal(bot.controlStates.get('forward'), true)
	} finally {
		actor.stop()
	}
})

test('recovery deadline releases the goal and prevents an immediate retry', t => {
	t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] })
	const bot = new SurvivalBot()
	const actor = createSurvivalActor(bot)
	try {
		actor.send({ type: 'USER_COMMAND', username: 'Steve', text: 'Work' })
		actor.send({ type: 'UPDATE_HEALTH', health: 8 })
		t.mock.timers.tick(60_000)
		assert.ok(
			actor.getSnapshot().matches({ MAIN_ACTIVITY: { TASKS: 'THINKING' } })
		)
		assert.match(actor.getSnapshot().context.lastReason ?? '', /timed out/)
		actor.send({ type: 'UPDATE_HEALTH', health: 8 })
		assert.ok(
			actor.getSnapshot().matches({ MAIN_ACTIVITY: { TASKS: 'THINKING' } })
		)
		actor.send({ type: 'UPDATE_HEALTH', health: 20 })
		actor.send({ type: 'UPDATE_HEALTH', health: 8 })
		assert.ok(
			actor
				.getSnapshot()
				.matches({ MAIN_ACTIVITY: { URGENT_NEEDS: 'EMERGENCY_HEALING' } })
		)
	} finally {
		actor.stop()
	}
})

test('a recovery controller exception exits the failed service', async () => {
	const bot = new SurvivalBot()
	bot.pathfinder.setGoal = () => {
		throw new Error('controller failed')
	}
	const actor = createSurvivalActor(bot)
	try {
		actor.send({ type: 'USER_COMMAND', username: 'Steve', text: 'Work' })
		actor.send({ type: 'UPDATE_FOOD', food: 5 })
		await delay(200)
		assert.ok(
			actor.getSnapshot().matches({ MAIN_ACTIVITY: { TASKS: 'THINKING' } })
		)
		assert.match(
			actor.getSnapshot().context.lastReason ?? '',
			/controller failed/
		)
	} finally {
		actor.stop()
	}
})

const createEnemy = (distance: number) => ({
	id: 1,
	type: 'hostile',
	name: 'zombie',
	height: 1.8,
	position: new Vec3(distance, 64, 0),
	isValid: true
})

class SurvivalBot extends EventEmitter {
	username = 'Bot'
	entity = { id: 999, position: new Vec3(0, 64, 0), height: 1.8 }
	entities = {}
	health = 20
	food = 20
	foodSaturation = 5
	oxygenLevel = 20
	inventoryItems: Array<{ name: string }> = []
	eatingCalls = 0
	stopEatingCalls = 0
	pvpForceStopCalls = 0
	hawkEyeStopCalls = 0
	pathfinderSetGoalCalls: unknown[] = []
	movementSetGoalCalls: unknown[] = []
	movementSteerCalls: Array<{ yaw: number; force: boolean | undefined }> = []
	lookCalls: Array<{ yaw: number; pitch: number; force: boolean | undefined }> =
		[]
	controlStates = new Map<string, boolean>()
	searchedPlayer: any = null
	inventory = {
		slots: Array.from({ length: 46 }, () => null),
		items: () => this.inventoryItems
	}
	registry = {
		isNewerOrEqualTo: () => true
	}
	movement = {
		goals: {
			Default: { id: 'default-goal' }
		},
		heuristic: {
			get: (_label: string) => ({
				target: (_target: Vec3) => ({
					avoid: (_avoid: boolean) => {}
				}),
				avoid: (_avoid: boolean) => {}
			})
		},
		setGoal: (goal: unknown) => {
			this.movementSetGoalCalls.push(goal)
		},
		getYaw: () => 0.25,
		steer: async (yaw: number, force?: boolean) => {
			this.movementSteerCalls.push({ yaw, force })
			await this.look(yaw, 0, force)
		}
	}
	game = { dimension: 'overworld' }
	time = { isDay: true, timeOfDay: 1000 }
	autoEat = {
		foodsByName: {
			bread: { saturation: 5 }
		},
		opts: { bannedFood: [] },
		findBestChoices: () => [{ name: 'bread' }],
		isEating: false
	}
	pathfinder = {
		setGoal: (goal: unknown) => {
			this.pathfinderSetGoalCalls.push(goal)
		},
		setMovements: () => {}
	}
	movements = {
		allowSprinting: true
	}
	hawkEye = {
		stop: () => {
			this.hawkEyeStopCalls += 1
		}
	}
	pvp = {
		forceStop: () => {
			this.pvpForceStopCalls += 1
		}
	}
	utils = {
		getAllFood: () => [{ name: 'bread' }],
		eating: async () => {
			this.eatingCalls += 1
		},
		stopEating: () => {
			this.stopEatingCalls += 1
		},
		findNearestEnemy: () => null,
		getMeleeWeapon: () => null,
		getRangeWeapon: () => null,
		getArrow: () => null,
		searchPlayer: () => this.searchedPlayer,
		countItemInInventory: () => 0
	}
	memory = {
		load: async () => {},
		save: async () => {},
		close: () => {},
		readEntries: () => [],
		saveEntry: () => null,
		updateEntryData: () => null,
		deleteEntry: () => false
	}
	hsm: any

	chat() {}
	quit() {}
	loadPlugin() {}
	async dig() {}
	async placeBlock() {}
	async equip() {}
	async consume() {}
	async craft() {}
	recipesFor() {
		return []
	}
	async sleep() {}
	blockAt() {
		return null
	}
	findBlocks() {
		return []
	}
	nearestEntity() {
		return this.searchedPlayer
	}
	getEquipmentDestSlot() {
		return 36
	}
	async openChest() {
		return {
			close() {},
			containerItems() {
				return []
			}
		}
	}
	async openContainer() {
		return {
			close() {},
			containerItems() {
				return []
			}
		}
	}
	async openFurnace() {
		return {
			close() {},
			containerItems() {
				return []
			}
		}
	}
	async openBlock() {
		return {
			close() {},
			containerItems() {
				return []
			}
		}
	}
	closeWindow() {}
	setControlState(control: string, state: boolean) {
		this.controlStates.set(control, state)
	}
	async look(yaw: number, pitch: number, force?: boolean) {
		this.lookCalls.push({ yaw, pitch, force })
	}
}

const createSurvivalActor = (bot: SurvivalBot) => {
	const actor = createActor(
		createBotMachine({
			thinkingActor: hangingActor,
			actors: {
				serviceEntitiesTracking: noopActor,
				serviceMeleeAttack: noopActor,
				serviceRangedSkirmish: noopActor
			}
		}),
		{
			input: { bot: bot as any }
		}
	)

	bot.hsm = {
		getContext: () => actor.getSnapshot().context
	}

	actor.start()
	return actor
}

const enterUrgentHealing = async (
	actor: ReturnType<typeof createSurvivalActor>,
	enemy: ReturnType<typeof createEnemy>,
	players: any[] = []
) => {
	publishEntities(actor, {
		type: 'UPDATE_ENTITIES',
		entities: [enemy as any, ...players],
		enemies: [enemy as any],
		players: players as any,
		combatTarget: {
			entity: enemy as any,
			distance: actor
				.getSnapshot()
				.context.bot!.entity.position.distanceTo(enemy.position)
		}
	})
	await delay(0)
	await delay(0)

	actor.send({
		type: 'UPDATE_HEALTH',
		health: 8
	})
	await delay(0)
	await delay(200)
}

test('emergency healing uses movement flee for close threats', async () => {
	const bot = new SurvivalBot()
	const actor = createSurvivalActor(bot)
	const enemy = createEnemy(8)

	try {
		await enterUrgentHealing(actor, enemy)

		assert.equal(
			actor.getSnapshot().matches({
				MAIN_ACTIVITY: { URGENT_NEEDS: 'EMERGENCY_HEALING' }
			} as never),
			true
		)
		assert.equal(actor.getSnapshot().context.movementOwner, 'MOVEMENT')
		assert.equal(bot.movementSetGoalCalls.length > 0, true)
		assert.equal(bot.movementSteerCalls.length > 0, true)
		assert.equal(bot.lookCalls.length > 0, true)
		assert.equal(bot.controlStates.get('forward'), true)
		assert.equal(bot.controlStates.get('back'), false)
		assert.equal(bot.controlStates.get('left'), false)
		assert.equal(bot.controlStates.get('right'), false)
		assert.equal(bot.stopEatingCalls > 0, true)
		assert.equal(bot.eatingCalls, 0)
	} finally {
		actor.stop()
	}
})

test('emergency healing initializes the default movement goal before reading proximity heuristic', async () => {
	const bot = new SurvivalBot()
	let activeGoalInitialized = false

	bot.movement = {
		goals: {
			Default: { id: 'default-goal', proximity: true } as any
		},
		heuristic: {
			get: (label: string) => {
				if (!activeGoalInitialized || label !== 'proximity') {
					throw new Error(`No active heuristics found with label '${label}'`)
				}

				return {
					target: (_target: Vec3) => ({
						avoid: (_avoid: boolean) => {}
					}),
					avoid: (_avoid: boolean) => {}
				}
			}
		},
		setGoal: (goal: unknown) => {
			activeGoalInitialized = goal === bot.movement.goals.Default
			bot.movementSetGoalCalls.push(goal)
		},
		getYaw: () => 0.25,
		steer: async (yaw: number, force?: boolean) => {
			bot.movementSteerCalls.push({ yaw, force })
		}
	}

	const actor = createSurvivalActor(bot)
	const enemy = createEnemy(8)

	try {
		await enterUrgentHealing(actor, enemy)

		assert.equal(actor.getSnapshot().context.movementOwner, 'MOVEMENT')
		assert.equal(bot.movementSetGoalCalls.length > 0, true)
	} finally {
		actor.stop()
	}
})

test('emergency healing uses pathfinder flee for medium-distance threats', async () => {
	const bot = new SurvivalBot()
	const actor = createSurvivalActor(bot)
	const enemy = createEnemy(18)

	try {
		await enterUrgentHealing(actor, enemy)

		assert.equal(actor.getSnapshot().context.movementOwner, 'PATHFINDER')
		assert.equal(
			bot.pathfinderSetGoalCalls.some(
				goal => goal && goal.constructor?.name === 'GoalXZ'
			),
			true
		)
		assert.equal(bot.eatingCalls, 0)
	} finally {
		actor.stop()
	}
})

test('emergency healing starts eating once threats are beyond safe distance', async () => {
	const bot = new SurvivalBot()
	const actor = createSurvivalActor(bot)
	const enemy = createEnemy(25)

	try {
		await enterUrgentHealing(actor, enemy)

		assert.equal(actor.getSnapshot().context.movementOwner, 'NONE')
		assert.equal(bot.eatingCalls > 0, true)
	} finally {
		actor.stop()
	}
})

test('emergency healing flees to a nearby safe player before generic flee logic', async () => {
	const bot = new SurvivalBot()
	bot.searchedPlayer = {
		id: 77,
		type: 'player',
		name: 'Steve',
		username: 'Steve',
		position: new Vec3(6, 64, 6),
		isValid: true
	}
	const actor = createSurvivalActor(bot)
	const enemy = {
		...createEnemy(8),
		position: new Vec3(18, 64, 0)
	}

	try {
		await enterUrgentHealing(actor, enemy, [bot.searchedPlayer])

		assert.equal(actor.getSnapshot().context.movementOwner, 'PATHFINDER')
		assert.equal(
			bot.pathfinderSetGoalCalls.some(
				goal => goal && goal.constructor?.name === 'GoalNear'
			),
			true
		)
	} finally {
		actor.stop()
	}
})
