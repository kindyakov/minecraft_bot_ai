# Minecraft Bot AI

Автономный Minecraft бот с иерархической машиной состояний (HSM) на базе XState v5 и интеграцией AI.

## Описание

Продвинутый Minecraft бот, способный к автономному поведению через систему приоритетных состояний. Использует иерархическую машину состояний для управления сложным поведением: сражения, выживание, выполнение задач и мирная деятельность.

## Ключевые возможности

**Иерархическая машина состояний:**

- Параллельные состояния (MAIN_ACTIVITY + MONITORING)
- Система приоритетов для переходов
- Защита от зацикливания (AntiLoopGuard)
- История переходов (history states)

**Боевая система:**

- Автоматическое обнаружение врагов
- Ближний и дальний бой
- Тактическое отступление при низком здоровье
- Адаптивная смена оружия

**Система выживания:**

- Автоматическое питание (EMERGENCY_EATING)
- Экстренное лечение (EMERGENCY_HEALING)
- Мониторинг здоровья, голода, кислорода
- Управление инвентарём и броней

**Мирная деятельность:**

- Добыча ресурсов (Mining)
- Строительство (Building)
- Фермерство (Farming)
- Следование за игроком (Following)

**Система задач:**

- Планировщик с приоритетами
- Поиск еды
- Ремонт инструментов/брони
- Хранение предметов в сундуках

## Требования

- Node.js >= 18.0.0
- Minecraft Java Edition сервер (1.8 - 1.21)
- 512 MB RAM минимум

## Установка

```bash
# Клонирование репозитория
git clone <repository-url>
cd Minecraft_bot

# Установка зависимостей
npm install

# Копирование конфигурации
cp config/.env.example .env
```

## Конфигурация

Отредактируй `.env` файл:

```env
# Сервер
MINECRAFT_HOST=localhost
MINECRAFT_PORT=22222
MINECRAFT_VERSION=1.20.1

# Аутентификация
MINECRAFT_USERNAME=Bot
AUTH_TYPE=offline  # offline | microsoft | mojang

MINECRAFT_VIEWER_PORT=9000
MINECRAFT_WEB_INVENTORY_PORT=9001

AI_PROVIDER=
AI_MODEL=
AI_API_KEY=
AI_TIMEOUT_MS=
AI_MAX_TOKENS=

NODE_ENV=production
```

## Запуск

```bash
# Development режим (с hot reload)
npm run dev

# Production режим
npm start

# Форматирование кода
npm run format
```

## Структура проекта

```
src/
├── ai/                # AI модули (планируется)
├── config/            # Конфигурации, логгер
├── core/              # Ядро: Bot, HSM
├── hsm/               # XState машина состояний
│   ├── actions/       # Entry/Exit/Always actions
│   ├── actors/        # Invoke actors (services)
│   ├── guards/        # Условия переходов
│   ├── utils/         # AntiLoopGuard, helpers
│   ├── context.js     # Начальный контекст
│   └── machine.js     # Определение машины
├── modules/
│   ├── commands/      # Команды от игрока
│   ├── connection/    # Подключение и плагины
│   └── plugins/       # Mineflayer плагины
├── scheduler/         # Система задач
├── utils/             # Утилиты (AntiStuck, botUtils)
└── index.js           # Entry point
```

## Технологии

**Core:**

- [mineflayer](https://github.com/PrismarineJS/mineflayer) ^4.33.0 - Minecraft bot framework
- [XState](https://xstate.js.org/) ^5.22.0 - State machine
- Node.js 18+ (ES Modules)

**Плагины:**

- mineflayer-pathfinder - Навигация
- mineflayer-pvp - Боевая система
- mineflayer-auto-eat - Автопитание
- mineflayer-armor-manager - Управление бронёй
- minecrafthawkeye - Дальний бой

**Инструменты:**

- winston - Логирование
- dotenv - Переменные окружения
- prettier - Форматирование

## Архитектура

Проект использует **иерархическую машину состояний** с параллельными регионами:

```
MINECRAFT_BOT (parallel)
├── MAIN_ACTIVITY (приоритетная активность)
│   ├── PEACEFUL     (приоритет 1-9: IDLE, MINING, FOLLOWING, etc)
│   ├── URGENT_NEEDS (приоритет 8: EMERGENCY_EATING, EMERGENCY_HEALING)
│   ├── COMBAT       (приоритет 7.5: DECIDING, FLEEING, ATTACKING)
│   └── TASKS        (приоритет 6: FOOD_SEARCH, REPAIR, DEPOSIT)
│
└── MONITORING (параллельный мониторинг)
    ├── HEALTH_MONITOR    → проверяет health
    ├── HUNGER_MONITOR    → проверяет food
    ├── ENTITIES_MONITOR  → отслеживает врагов
    └── CHAT_MONITOR      → слушает команды
```

**Переходы происходят по приоритетам:**

- FOLLOWING (9) может прервать URGENT_NEEDS (8)
- COMBAT (7.5) может прервать MINING (7)
- TASKS (6) не может прервать COMBAT (7.5)

Подробнее: [./architecture.md](docs/architecture.md)

## Разработка

**Команды:**

```bash
npm run dev      # Разработка с nodemon
npm start        # Production запуск
npm run format   # Prettier форматирование
npm test         # Тесты (в разработке)
```

**Добавление нового состояния:**

1. Добавь состояние в `src/hsm/machine.js`
2. Создай actions в `src/hsm/actions/entry/` и `exit/`
3. Добавь guards в `src/hsm/guards/`
4. Зарегистрируй в `index.*.js` файлах

**Отладка:**

```javascript
// Включи debug логи в src/hsm/actions/entry/
console.log('Вход в состояние X')

// Проверь переходы
console.log('Активные состояния:', this.actor.getSnapshot().value)
```

## Безопасность

**AntiLoopGuard:**

- Защита от зацикливания (max 15 transitions/sec)
- Аварийная остановка при 100 переходах/sec
- Логирование подозрительных паттернов

**AntiStuck:**

- Обнаружение застревания бота
- Автоматические попытки освобождения
- Игнорирование недоступных целей

## Производительность

- Оптимизация: 5-15 переходов состояний в секунду (нормально)
- Memory: ~100-150 MB в работе
- CPU: Низкое потребление (pathfinding может увеличить)

## Известные проблемы

1. **physicTick deprecated** - Используется устаревшее событие, будет исправлено
2. **Зацикливание FLEEING↔DECIDING** - Если health на границе threshold
3. **Застревание в стенах** - AntiStuck в разработке

## Планы (Roadmap)

- [ ] AI интеграция для принятия решений
- [ ] Улучшенная боевая система (combo attacks)
- [ ] Автоматическая добыча и крафт
- [ ] Мультибот координация
- [ ] Web Inspector для визуализации HSM
- [ ] Голосовые команды

## Документация

- [Архитектура](./architecture.md) - Детальная архитектура проекта
- [FSM](./architecture_fsm.md) - Описание машины состояний
- [Описание бота](./minecraft_bot.md) - Общее описание

## Лицензия

ISC

## Контакты

Вопросы и предложения: [создай issue](../../../issues)

---

**Версия:** 1.0.0  
**Статус:** В активной разработке
