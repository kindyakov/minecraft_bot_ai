import 'dotenv/config';
import { mineflayer as mineFlayerViewer } from 'prismarine-viewer';

export const initViewer = (bot) => {
  mineFlayerViewer(bot, { port: process.env.MINECRAFT_VIEWER_PORT || 3000 })
}