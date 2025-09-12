import 'dotenv/config';
import inventoryViewer from 'mineflayer-web-inventory';

export const loadWebInventory = (bot) => {
  inventoryViewer(bot, {
    port: process.env.MINECRAFT_WEB_INVENTORY_PORT || 3001,
  })
}