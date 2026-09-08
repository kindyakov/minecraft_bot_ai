import { Weapons } from 'minecrafthawkeye'

import type { Entity, Item } from '@/types'

import Logger from '@/config/logger'

import type { MachineContext } from '@/hsm/context'
import {
	type BaseServiceState,
	createStatefulService
} from '@/hsm/helpers/createStatefulService.js'

import { canSeeEnemy } from '@/utils/combat/enemyVisibility'
import {
	stopMeleeAttack,
	stopRangedAttack
} from '@/utils/combat/runtimeControl'

interface MeleeAttackState extends BaseServiceState {
	currentTarget: Entity | null
}

interface RangedSkirmishState extends BaseServiceState {
	currentTarget: Entity | null
	weapon: Item | null
	weaponType: Weapons | null
}

const logCombatRuntime = (event: string, payload: Record<string, unknown>) => {
	Logger.debug(`[COMBAT] ${event}`, payload)
}

const isPvpTargetActive = (bot: any, enemy: Entity) =>
	bot.pvp?.target?.id === enemy.id

const meleeExitRangeBuffer = 1.5
const resolveCombatTarget = (
	context: MachineContext
): MachineContext['combatTarget'] => {
	const entity = context.combatTarget.entity
	if (!entity || entity.isValid === false)
		return { entity: null, distance: Infinity }
	return {
		entity,
		distance:
			context.bot?.entity.position.distanceTo(entity.position) ?? Infinity
	}
}

const issueMeleeAttack = (
	bot: any,
	enemy: Entity,
	sendBack: (event: any) => void
) => {
	const attackResult = bot.pvp.attack(enemy)

	if (attackResult instanceof Promise) {
		void attackResult.catch((error: unknown) => {
			Logger.error('[COMBAT] melee_attack_failed', {
				error:
					error instanceof Error
						? (error.stack ?? error.message)
						: String(error)
			})
			sendBack({
				type: 'ERROR',
				error: error instanceof Error ? error.message : String(error)
			})
		})
	}
}

const getWeaponType = (weaponName: string): Weapons => {
	if (weaponName.includes('crossbow')) return Weapons.crossbow
	return Weapons.bow
}

const resolveRangedLoadout = (bot: any) => {
	const weapon = bot.utils.getRangeWeapon()
	const arrows = bot.utils.getArrow()

	if (!weapon || !arrows) {
		return null
	}

	return {
		weapon,
		weaponType: getWeaponType(weapon.name)
	}
}

const canExitMeleeToRanged = (
	bot: any,
	context: any,
	target: { entity: Entity | null; distance: number }
) => {
	if (!target.entity) {
		return false
	}

	return (
		!context.rangedUnavailable &&
		target.distance >
			context.preferences.enemyMeleeRange + meleeExitRangeBuffer &&
		resolveRangedLoadout(bot) !== null &&
		canSeeEnemy(bot, target.entity)
	)
}

const serviceMeleeAttack = createStatefulService<MeleeAttackState>({
	name: 'MeleeAttack',
	operationTimeoutMs: 15_000,
	tickInterval: 500,
	initialState: {
		currentTarget: null
	},

	onStart: async ({ bot, abortSignal }) => {
		bot.utils.stopEating?.()

		const meleeWeapon = bot.utils.getMeleeWeapon()

		if (!meleeWeapon) {
			return
		}

		await bot.equip(meleeWeapon, 'hand')
		if (abortSignal.aborted) {
			return
		}

		Logger.debug(`Melee equipped: ${meleeWeapon.name}`)
	},

	onTick: ({ context, state, bot, sendBack, setState, abortSignal }) => {
		if (!bot.utils.getMeleeWeapon()) {
			sendBack({ type: 'WEAPON_BROKEN' })
			return
		}
		const target = resolveCombatTarget(context)

		if (!target.entity) {
			if (state.currentTarget) {
				stopMeleeAttack(bot, 'no_enemies', logCombatRuntime)
				setState({ currentTarget: null })
			}

			sendBack({ type: 'NO_ENEMIES' })
			return
		}

		if (canExitMeleeToRanged(bot, context, target)) {
			if (state.currentTarget) {
				stopMeleeAttack(bot, 'switch_to_ranged', logCombatRuntime)
				setState({ currentTarget: null })
			}

			sendBack({ type: 'ENEMY_BECAME_FAR' })
			return
		}

		const enemy = target.entity
		sendBack({ type: 'APPROACH_SAMPLE' })
		if (abortSignal.aborted) return

		if (!state.currentTarget || state.currentTarget.id !== enemy.id) {
			if (state.currentTarget) {
				stopMeleeAttack(bot, 'retarget', logCombatRuntime)
			}

			issueMeleeAttack(bot, enemy, sendBack)
			setState({ currentTarget: enemy })
			logCombatRuntime('melee_attack_issued', {
				enemyId: enemy.id,
				distance: Number(target.distance.toFixed(2)),
				reason: 'target_changed'
			})
			return
		}

		if (!isPvpTargetActive(bot, enemy)) {
			issueMeleeAttack(bot, enemy, sendBack)
			logCombatRuntime('melee_attack_issued', {
				enemyId: enemy.id,
				distance: Number(target.distance.toFixed(2)),
				reason: 'controller_lost_target'
			})
		}
	},

	onEvents: () => ({
		path_update: ({ sendBack }, result: { status?: string }) => {
			if (result.status === 'noPath' || result.status === 'timeout')
				sendBack({ type: 'APPROACH_ROUTE_FAILED' })
		}
	}),
	onCleanup: ({ bot, setState }) => {
		stopMeleeAttack(bot, 'cleanup', logCombatRuntime)
		setState({ currentTarget: null })
	}
})

const serviceRangedSkirmish = createStatefulService<RangedSkirmishState>({
	name: 'RangedSkirmish',
	operationTimeoutMs: 15_000,
	asyncTickInterval: 250,
	initialState: {
		currentTarget: null,
		weapon: null,
		weaponType: null
	},

	onStart: async ({ bot, context, sendBack, setState, abortSignal }) => {
		bot.utils.stopEating?.()

		const loadout = resolveRangedLoadout(bot)
		const target = resolveCombatTarget(context)

		if (!loadout || !target.entity || !canSeeEnemy(bot, target.entity)) {
			sendBack({ type: 'ENEMY_BECAME_CLOSE' })
			return
		}

		try {
			await bot.equip(loadout.weapon, 'hand')
			if (abortSignal.aborted) {
				return
			}

			setState(loadout)
		} catch (error) {
			sendBack({
				type: 'RANGED_UNAVAILABLE',
				reason: error instanceof Error ? error.message : String(error)
			})
		}
	},

	onAsyncTick: async ({
		context,
		state,
		bot,
		sendBack,
		setState,
		abortSignal
	}) => {
		const target = resolveCombatTarget(context)

		if (!target.entity) {
			if (state.currentTarget) {
				stopRangedAttack(bot, 'no_enemies', logCombatRuntime)
				setState({ currentTarget: null, weapon: null, weaponType: null })
			}

			sendBack({ type: 'NO_ENEMIES' })
			return
		}

		const enemy = target.entity
		const loadout = resolveRangedLoadout(bot)
		const hasSight = canSeeEnemy(bot, enemy)

		if (
			target.distance <= context.preferences.enemyMeleeRange ||
			!loadout ||
			!hasSight
		) {
			if (state.currentTarget) {
				stopRangedAttack(bot, 'switch_to_melee', logCombatRuntime)
				setState({ currentTarget: null, weapon: null, weaponType: null })
			}

			sendBack({ type: 'ENEMY_BECAME_CLOSE' })
			return
		}

		if (
			state.weapon !== loadout.weapon ||
			state.weaponType !== loadout.weaponType
		) {
			try {
				await bot.equip(loadout.weapon, 'hand')
				if (abortSignal.aborted) {
					return
				}
			} catch (error) {
				sendBack({
					type: 'RANGED_UNAVAILABLE',
					reason: error instanceof Error ? error.message : String(error)
				})
				return
			}
		}

		if (
			!state.currentTarget ||
			state.currentTarget.id !== enemy.id ||
			state.weapon !== loadout.weapon ||
			state.weaponType !== loadout.weaponType
		) {
			if (state.currentTarget) {
				stopRangedAttack(bot, 'retarget', logCombatRuntime)
			}

			bot.hawkEye.autoAttack(enemy, loadout.weaponType)
			setState({
				currentTarget: enemy,
				weapon: loadout.weapon,
				weaponType: loadout.weaponType
			})
			logCombatRuntime('ranged_attack_issued', {
				enemyId: enemy.id,
				distance: Number(target.distance.toFixed(2)),
				weapon: loadout.weapon.name
			})
		}
	},

	onCleanup: ({ bot, setState }) => {
		stopRangedAttack(bot, 'cleanup', logCombatRuntime)
		setState({ currentTarget: null, weapon: null, weaponType: null })
	}
})

const serviceRangedAttack = serviceRangedSkirmish

export default {
	serviceMeleeAttack,
	serviceRangedAttack,
	serviceRangedSkirmish
}
