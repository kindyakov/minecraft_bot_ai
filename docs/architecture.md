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
│   │       ├── 📄 movement.js
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

```
Minecraft_bot/
├── 📁 config/                              ← ✅ Внешние конфигурации проекта
│   └── 📄 .env.example                     ← ✅ Шаблон переменных окружения
│
├── 📁 docs/                                ← ✅ Документация проекта
│   ├── 📄 architecture.md                  ← ✅ Общая архитектура
│   ├── 📄 architecture_fsm.md              ← ✅ Архитектура FSM (машины состояний)
│   ├── 📄 minecraft_bot.md                 ← ✅ Подробная документация бота
│   └── 📄 README.md                        ← ✅ Основное описание проекта
│
├── 📁 logs/                                ← ✅ Логи работы бота
│   ├── 📄 bot.log                          ← ✅ Основной лог
│   └── 📄 error.log                        ← ✅ Лог ошибок
│
├── 📁 src/                                 ← ✅ Исходный код приложения
│   ├── 📁 ai/                              ← 🧠 Модули искусственного интеллекта
│   │
│   ├── 📁 config/                          ← ⚙️ Конфигурации приложения
│   │   ├── 📄 commands.js                  ← ✅ Настройки команд
│   │   ├── 📄 config.js                    ← ✅ Общие настройки
│   │   └── 📄 logger.js                    ← ✅ Конфиг логирования
│   │
│   ├── 📁 core/                            ← 🏗 Базовые системные компоненты
│   │   ├── 📄 bot.js                       ← ✅ MinecraftBot — управление ботом
│   │   └── 📄 hsm.js                       ← ✅ FSM ядро — переходы и стек состояний
│   │
│   ├── 📁 hsm/                             ← 🎛 FSM (иерархическая машина состояний)
│   │   ├── 📁 actions/                     ← ⚡️ Действия состояний
│   │   │   ├── 📁 always/                  ← ✅ Выполняются всегда
│   │   │   ├── 📁 entry/                   ← ✅ Логика при входе в состояние
│   │   │   ├── 📁 exit/                    ← ✅ Логика при выходе
│   │   │   ├── 📁 save/                    ← ✅ Сохранение состояния
│   │   │   ├── 📁 update/                  ← ✅ Логика при обновлении
│   │   │   └── 📄 index.actions.js         ← ✅ Реестр действий
│   │   ├── 📁 actors/                      ← 👥 Акторы FSM
│   │   ├── 📁 config/                      ← ⚙️ Конфиг FSM
│   │   │   └── 📄 priorities.js            ← ✅ Числовые приоритеты
│   │   ├── 📁 guards/                      ← 🔒 Условия переходов (guards)
│   │   ├── 📁 utils/                       ← 🔧 Вспомогательные функции FSM
│   │   ├── 📄 context.js                   ← ✅ Контекст FSM
│   │   └── 📄 machine.js                   ← ✅ Основная машина состояний
│   │
│   ├── 📁 modules/                         ← 📦 Функциональные модули
│   │   ├── 📁 commands/                    ← ✅ Команды от игроков
│   │   ├── 📁 connection/                  ← ✅ Подключение к серверу
│   │   └── 📁 plugins/                     ← ✅ Плагины Mineflayer
│   │
│   ├── 📁 scheduler/                       ← ⏱ Планировщик задач
│   │   ├── 📁 tasks/                       ← ✅ Набор задач
│   │   ├── 📄 index.js                     ← ✅ Инициализация планировщика
│   │   └── 📄 priorities.js                ← ✅ Приоритеты задач
│   │
│   ├── 📁 tests/                           ← 🧪 Тесты проекта
│   ├── 📁 utils/                           ← 🔧 Общие утилиты
│   │   ├── 📁 general/                     ← ✅ Общие функции
│   │   └── 📁 minecraft/                   ← ✅ Утилиты для работы с Minecraft
│   │
│   └── 📄 index.js                         ← ✅ Точка входа приложения
│
├── 📄 .env                                 ← ✅ Переменные окружения
├── 📄 .gitignore                           ← ✅ Игнорируемые файлы git
├── 📄 .prettierrc                          ← ✅ Конфиг форматтера
├── 📄 nodemon.json                         ← ✅ Конфиг для разработки (hot reload)
├── 📄 package-lock.json                    ← ✅ Lock-файл зависимостей
└── 📄 package.json                         ← ✅ Зависимости и скрипты проекта
```
