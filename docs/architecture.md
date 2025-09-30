```
Minecraft_bot/
├── 📁 config/
│   └── 📄 .env.example
├── 📁 docs/
│   ├── 📄 architecture.md
│   ├── 📄 architecture_fsm.md
│   ├── 📄 minecraft_bot.md
│   └── 📄 README.md
├── 📁 logs/
│   ├── 📄 bot.log
│   └── 📄 error.log
├── 📁 src/
│   ├── 📁 ai/
│   ├── 📁 config/
│   │   ├── 📄 commands.js
│   │   ├── 📄 config.js
│   │   └── 📄 logger.js
│   ├── 📁 core/
│   │   ├── 📄 bot.js
│   │   └── 📄 hsm.js
│   ├── 📁 hsm/
│   │   ├── 📁 actions/
│   │   │   ├── 📁 always/
│   │   │   │   ├── 📄 combat.always.js
│   │   │   │   ├── 📄 index.always.js
│   │   │   │   └── 📄 monitoring.always.js
│   │   │   ├── 📁 entry/
│   │   │   │   ├── 📄 combat.entry.js
│   │   │   │   ├── 📄 index.entry.js
│   │   │   │   ├── 📄 monitoring.entry.js
│   │   │   │   ├── 📄 pefceful.entry.js
│   │   │   │   ├── 📄 tasks.entry.js
│   │   │   │   └── 📄 urgentNeeds.entry.js
│   │   │   ├── 📁 exit/
│   │   │   │   ├── 📄 combat.exit.js
│   │   │   │   ├── 📄 index.exit.js
│   │   │   │   ├── 📄 pefceful.exit.js
│   │   │   │   └── 📄 urgentNeeds.exit.js
│   │   │   ├── 📁 save/
│   │   │   │   ├── 📄 index.save.js
│   │   │   │   └── 📄 pefceful.save.js
│   │   │   ├── 📁 update/
│   │   │   │   ├── 📄 combat.update.js
│   │   │   │   ├── 📄 index.update.js
│   │   │   │   ├── 📄 monitoring.update.js
│   │   │   │   └── 📄 root.update.js
│   │   │   └── 📄 index.actions.js
│   │   ├── 📁 actors/
│   │   │   ├── 📄 combat.actors.js
│   │   │   ├── 📄 index.actors.js
│   │   │   └── 📄 monitoring.actors.js
│   │   ├── 📁 config/
│   │   │   └── 📄 priorities.js
│   │   ├── 📁 guards/
│   │   │   ├── 📄 combat.guards.js
│   │   │   ├── 📄 index.guards.js
│   │   │   ├── 📄 monitoring.guards.js
│   │   │   ├── 📄 peaceful.guards.js
│   │   │   └── 📄 tasks.guards.js
│   │   ├── 📁 utils/
│   │   │   ├── 📄 findNearbyEnemies.js
│   │   │   ├── 📄 getPriority.js
│   │   │   └── 📄 isEntityOfType.js
│   │   ├── 📄 context.js
│   │   └── 📄 machine.js
│   ├── 📁 modules/
│   │   ├── 📁 commands/
│   │   │   ├── 📄 BaseCommand.js
│   │   │   ├── 📄 CommandHandler.js
│   │   │   ├── 📄 guard.js
│   │   │   ├── 📄 help.js
│   │   │   └── 📄 index.commands.js
│   │   ├── 📁 connection/
│   │   │   └── 📄 index.js
│   │   └── 📁 plugins/
│   │       ├── 📄 armorManager.js
│   │       ├── 📄 autoEat.js
│   │       ├── 📄 dashboard.js
│   │       ├── 📄 goals.js
│   │       ├── 📄 index.plugins.js
│   │       ├── 📄 pathfinder.js
│   │       ├── 📄 pvp.js
│   │       ├── 📄 tool.js
│   │       ├── 📄 viewer.js
│   │       └── 📄 webInventory.js
│   ├── 📁 scheduler/
│   │   ├── 📁 tasks/
│   │   ├── 📄 index.js
│   │   └── 📄 priorities.js
│   ├── 📁 tests/
│   ├── 📁 utils/
│   │   ├── 📁 general/
│   │   │   └── 📄 generateId.js
│   │   └── 📁 minecraft/
│   │       ├── 📄 AntiStuck.js
│   │       └── 📄 botUtils.js
│   └── 📄 index.js
├── 📄 .env
├── 📄 .gitignore
├── 📄 .prettierrc
└── 📄 nodemon.json
```
