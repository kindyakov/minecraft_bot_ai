import { mineflayer as mineFlayerViewer } from 'prismarine-viewer'

import type { Bot } from '@/types'

import Config from '@/config/config'

export const initViewer = (bot: Bot): void => {
	mineFlayerViewer(bot, {
		port: Config.diagnostics.viewerPort,
		firstPerson: true
	})
}
