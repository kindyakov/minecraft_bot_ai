import inventoryViewer from 'mineflayer-web-inventory'

import type { Bot } from '@/types'

import Config from '@/config/config'

export const loadWebInventory = (bot: Bot): void => {
	inventoryViewer(bot, {
		port: Config.diagnostics.webInventoryPort
	})
}
