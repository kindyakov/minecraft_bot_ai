import type { Bot } from '@/types'

import Logger from '@/config/logger'

import { initPlugins, loadPlugins } from '@/modules/plugins/index.plugins'

export const initConnection = (bot: Bot): void => {
	loadPlugins(bot)

	bot.once('spawn', () => {
		initPlugins(bot)
		Logger.info('Бот заспавнился')
		bot.emit('botReady')
	})

	bot.on('end', reason => {
		Logger.warn(`Бот отключился: ${reason}`)
		bot.emit('botDisconnected', reason)
	})

	bot.on('error', err => {
		Logger.error('Ошибка бота:', err)
		bot.emit('botError', err)
	})
}
