import pgk from "mineflayer-pvp"

const { pvp } = pgk

export const loadPvp = (bot) => {
  bot.loadPlugin(pvp)
}