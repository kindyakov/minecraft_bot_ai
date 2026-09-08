import type { Bot } from '@/types'

import type { PendingExecution } from '../contracts/execution.js'
import type { TaskContext } from '../taskContext.js'
import { MEMORY_ENTRY_TYPES, toMemoryEntryType } from '../tools/shared.js'
import {
	type GroundedTurnFacts,
	entityNameTypePairKey,
	hasAnyPositionCapability,
	hasPositionCapability,
	normalizeFactValue,
	tryParsePosition
} from './grounding.js'
import { executionSignature } from './transcript.js'

const WINDOW_ZONES = [
	'player_inventory',
	'hotbar',
	'container',
	'input',
	'fuel',
	'output'
]

const UNSUPPORTED_WORKSTATIONS_BY_CATEGORY: Record<string, string[]> = {
	craft: ['stonecutter']
}

const isUnsupportedWorkstationValue = (
	category: string,
	args: Record<string, unknown>
): boolean => {
	const blocked = UNSUPPORTED_WORKSTATIONS_BY_CATEGORY[category] ?? []
	if (blocked.length === 0) {
		return false
	}

	const tags = Array.isArray(args.tags) ? args.tags.map(String) : []
	const description = String(args.description ?? '').toLowerCase()
	const interactable = String(
		(args.data as Record<string, unknown> | undefined)?.interactable ?? ''
	).toLowerCase()
	const values = [
		...tags.map(tag => tag.toLowerCase()),
		description,
		interactable
	]

	return blocked.some(workstation =>
		values.some(value => value.includes(workstation))
	)
}

const getNavigateBlockName = (
	bot: Bot,
	args: Record<string, unknown>
): string | null => {
	const position = args.position
	if (
		!position ||
		typeof position !== 'object' ||
		Array.isArray(position) ||
		typeof (position as Record<string, unknown>).x !== 'number' ||
		typeof (position as Record<string, unknown>).y !== 'number' ||
		typeof (position as Record<string, unknown>).z !== 'number'
	) {
		return null
	}

	const block = bot.blockAt(position as { x: number; y: number; z: number })
	return block?.name ?? null
}

export const validateInlineTool = (
	name: string,
	args: Record<string, unknown>,
	taskContext: TaskContext
): string | null => {
	if (name === 'memory_save') {
		if (!toMemoryEntryType(args.type)) {
			return `Inline tool "memory_save" requires type to be one of: ${MEMORY_ENTRY_TYPES.join(', ')}`
		}

		if (!tryParsePosition(args.position)) {
			return 'Inline tool "memory_save" requires a finite position {x, y, z}'
		}

		if (
			taskContext.category === 'craft' &&
			isUnsupportedWorkstationValue(taskContext.category, args)
		) {
			return 'Unsupported workstation memory save is not relevant to crafting runtime'
		}

		return null
	}

	if (name === 'memory_delete') {
		if (typeof args.id !== 'string' && !tryParsePosition(args.position)) {
			return 'Inline tool "memory_delete" requires an id or a finite position {x, y, z}'
		}

		return null
	}

	if (
		name === 'inspect_blocks' ||
		name === 'inspect_entities' ||
		name === 'memory_read'
	) {
		if (
			args.max_distance !== undefined &&
			(typeof args.max_distance !== 'number' ||
				!Number.isFinite(args.max_distance) ||
				args.max_distance <= 0)
		) {
			return `Inline tool "${name}" requires max_distance to be a positive finite number`
		}
	}

	return null
}

export const validateExecutionTool = (
	bot: Bot,
	execution: PendingExecution,
	taskContext: TaskContext,
	groundedFacts: GroundedTurnFacts
): string | null => {
	if (
		taskContext.rejectedStepSignatures.includes(
			executionSignature(execution.toolName, execution.args)
		)
	) {
		return 'Execution step was already rejected as irrelevant for the current task'
	}

	if (
		taskContext.category === 'craft' &&
		execution.toolName === 'navigate_to'
	) {
		const blockName = getNavigateBlockName(bot, execution.args)
		if (
			blockName &&
			(UNSUPPORTED_WORKSTATIONS_BY_CATEGORY[taskContext.category] ?? []).includes(
				blockName
			)
		) {
			return 'Navigate target points to an unsupported workstation for crafting tasks'
		}
	}

	const targetPosition = tryParsePosition(execution.args.position)
	const hasGroundedPosition =
		targetPosition !== null &&
		hasAnyPositionCapability(groundedFacts, targetPosition)

	switch (execution.toolName) {
		case 'navigate_to':
			if (!hasGroundedPosition) {
				return 'Execution tool "navigate_to" requires any grounded target position in this turn'
			}
			return null
		case 'break_block':
			if (
				!targetPosition ||
				!hasPositionCapability(groundedFacts, targetPosition, 'break_block')
			) {
				return 'Execution tool "break_block" requires a block position grounded by inspect_blocks in this turn'
			}
			return null
		case 'mine_resource': {
			const blockName = normalizeFactValue(execution.args.block_name)
			const count = execution.args.count
			if (!blockName) {
				return 'Execution tool "mine_resource" requires block_name'
			}
			if (
				typeof count !== 'number' ||
				!Number.isFinite(count) ||
				!Number.isInteger(count) ||
				count <= 0 ||
				count > 64
			) {
				return 'Execution tool "mine_resource" requires an integer count from 1 to 64'
			}
			return null
		}
		case 'open_window':
			if (
				!targetPosition ||
				!hasPositionCapability(groundedFacts, targetPosition, 'open_window')
			) {
				return 'Execution tool "open_window" requires a window-compatible position grounded by inspect_blocks(interactable), inspect_window, or container/location memory_read in this turn'
			}
			return null
		case 'place_block':
			if (
				!targetPosition ||
				!hasPositionCapability(groundedFacts, targetPosition, 'place_block')
			) {
				return 'Execution tool "place_block" requires a grounded target position from memory_read/inspect_blocks/inspect_window in this turn'
			}
			return null
		case 'follow_entity': {
			const requestedName = normalizeFactValue(execution.args.entity_name)
			const requestedType = normalizeFactValue(execution.args.entity_type)
			if (!requestedName && !requestedType) {
				return 'Execution tool "follow_entity" requires entity_name or entity_type grounded by inspect_entities in this turn'
			}
			if (
				requestedName &&
				requestedType &&
				!groundedFacts.entityNameTypePairs.has(
					entityNameTypePairKey(requestedName, requestedType)
				)
			) {
				return `Execution tool "follow_entity" requires entity_name "${String(execution.args.entity_name)}" and entity_type "${String(execution.args.entity_type)}" to refer to the same grounded entity fact from inspect_entities in this turn`
			}
			if (requestedName && !groundedFacts.entityNames.has(requestedName)) {
				return `Execution tool "follow_entity" requested entity_name "${String(execution.args.entity_name)}" that is not grounded by inspect_entities in this turn`
			}
			if (requestedType && !groundedFacts.entityTypes.has(requestedType)) {
				return `Execution tool "follow_entity" requested entity_type "${String(execution.args.entity_type)}" that is not grounded by inspect_entities in this turn`
			}
			return null
		}
		case 'transfer_item': {
			const sourceZone = execution.args.source_zone
			const destZone = execution.args.dest_zone
			if (
				typeof sourceZone !== 'string' ||
				!WINDOW_ZONES.includes(sourceZone)
			) {
				return `Execution tool "transfer_item" requires source_zone to be one of: ${WINDOW_ZONES.join(', ')}`
			}
			if (typeof destZone !== 'string' || !WINDOW_ZONES.includes(destZone)) {
				return `Execution tool "transfer_item" requires dest_zone to be one of: ${WINDOW_ZONES.join(', ')}`
			}
			if (sourceZone === destZone) {
				return 'Execution tool "transfer_item" requires source_zone and dest_zone to differ'
			}
			if (
				typeof execution.args.item_name !== 'string' ||
				execution.args.item_name.trim().length === 0
			) {
				return 'Execution tool "transfer_item" requires a non-empty item_name'
			}
			if (
				typeof execution.args.count !== 'number' ||
				!Number.isInteger(execution.args.count) ||
				execution.args.count <= 0
			) {
				return 'Execution tool "transfer_item" requires count to be a positive integer'
			}
			return null
		}
		case 'close_window':
			return null
		default:
			return null
	}
}
