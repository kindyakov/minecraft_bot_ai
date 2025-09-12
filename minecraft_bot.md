# 🤖 Minecraft Bot

## 📂 Архитектура проекта

```
minecraft-bot/
├── src/
│ ├── core/ # базовые вещи
│ │ ├── bot.js # класс MinecraftBot
│ │ ├── config.js # dotenv, парсинг конфигов
│ │ ├── cmdSate.js # активные команды бота
│ │ ├── logger.js # winston
│ │ └── utils.js # общие утилиты
│ ├── modules/
│ │ ├── connection/ # Подключение/реконнект бота
│ │ │ └── index.js
│ │ ├── command_handler/ # обработка команд
│ │ │ ├── index.js # регистрация/парсинг
│ │ │ └── commands/
│ │ │ │ ├── follow.js
│ │ │ │ ├── stop.js
│ │ │ │ ├── help.js
│ │ │ │ ├── guard.js
│ │ │ │ ├── mine.js
│ │ │ │ ├── build.js
│ │ │ │ └── ...
│ │ ├── controls/ # низкоуровневые действия
│ │ │ ├── movement.js # pathfinder: ходьба, навигация
│ │ │ ├── interaction.js # клик, place, attack
│ │ │ └── inventory.js # работа с инвентарём
│ │ ├── states/ # FSM состояния
│ │ │ ├── idle.js # ждать/периодические AI решения
│ │ │ ├── follow.js # следовать
│ │ │ ├── guard.js # охрана/защищать/выживание
│ │ │ ├── farm.js # фермерство
│ │ │ ├── mine.js # добыча ресурсов
│ │ │ └── build.js # строительство
│ │ ├── ai/ # AI адаптер
│ │ │ └── index.js # вызовы API + schema validation
│ │ ├── scheduler/ # планировщик задач
│ │ │ └── index.js
│ │ └── utils/ # локальные хелперы
│ │ └── index.js
│ ├── tests/ # unit/integration тесты
│ └── index.js # точка входа
├── config/
│ └── .env.example
├── docs/
│ └── README.md
├── .eslintrc.js
├── .prettierrc.js
├── .gitignore
├── package.json
├── package-lock.json
└── nodemon.json
```

## ⚙️ Основные зависимости

- `mineflayer` — основной API для Minecraft
- `mineflayer-pathfinder` — навигация
- `mineflayer-collectblock` — сбор блоков
- `minecraft-data` — доступ к данным о мире
- `@nxg-org/mineflayer-custom-pvp` - пвп режим бота
- `mineflayer-armor-manager` - автоматически экипировать более качественную броню
- `dotenv` — конфиги
- `winston` — логирование
- `axios` — вызовы внешних API (AI)
- `ajv` — валидация JSON схем
- `prettier` — стиль кода

## 🔑 Конфиги (`.env.example`)

```
MINECRAFT_HOST=localhost
MINECRAFT_PORT=22222
MINECRAFT_USERNAME=bot
MINECRAFT_VERSION=1.20.1

AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini
AI_API_KEY=sk-...
AI_TIMEOUT_MS=800
AI_MAX_TOKENS=300
```

## 🚦 Жизненный цикл бота

1. **Запуск:**

- Чтение конфигов
- Создание экземпляра MinecraftBot
- Подключение к серверу

2. **Инициализация:**

- Регистрация обработчиков событий
- Запуск FSM (состояние IDLE)
- Запуск планировщика задач

3. **Работа:**

- FSM обрабатывает команды и события
- AI принимает высокоуровневые решения (например, выбор задачи)
- Scheduler управляет параллельными задачами с приоритетами

4. **Отключение/реконнект:**

- При разрыве соединения запускается реконнект
- Состояние сохраняется (по возможности)

## 🔔 Событийная модель

- Mineflayer события: `spawn`, `death`, `chat`, `health`, `entityHurt`, `blockUpdate`
- Кастомные события:
  - `state:changed` — смена FSM состояния
  - `task:completed` — задача завершена
  - `ai:decision` — новое решение AI
    Общение между модулями — через `EventEmitter`.

## 🧠 **FSM** + **AI** + **Scheduler**

- FSM управляет поведением (`Idle`, `Follow`, `Guard`, `Farm`, `Mine`, `Build`).
- AI работает в `IDLE` или при принятии новых стратегических задач.
- Scheduler выполняет задачи внутри состояния (например, идти → копать → сложить ресурсы).

## 🔑 Приоритеты:

1. Команды игрока (manual override)
2. Выполняемые задачи FSM
3. AI-решения

## Ключевые особенности:

- Dependency Injection через конструкторы
- FSM для управления поведением
- Планировщик задач с приоритетами
- AI только для высокоуровневых решений
- Строгая валидация AI ответов через JSON Schema
- Comprehensive логирование с correlation ID

## 📜 Поведенческие состояния

- **IDLE** - ожидание, периодические AI решения
- **FOLLOW** - следование за игроком
- **GUARD** - защита/выживание
- **FARM** - автоматическое фермерство
- **MINE** - добыча ресурсов
- **BUILD** - строительство по планам

## 📝 Логирование

- Используется `winston`
- Уровни: `info`, `debug`, `error`
- Каждая задача помечается correlation ID
- Поддержка вывода в stdout и файл (опционально ELK/Prometheus)

## ✅ Тестирование

- Unit: утилиты и контролы
- Integration: тесты подключения к серверу
- E2E: проверка полного цикла (команда → FSM → действие)
- Инструменты: jest или vitest
- Прогон тестов в CI при каждом пуше

## 🔌 Расширяемость

- Новые состояния FSM добавляются отдельным модулем.
- Команды регистрируются как плагины (`command_handler/commands`).
- Поддержка внешних mineflayer-плагинов.

## 🔒 Безопасность

1. Белый список разрешенных действий
2. Ограничение времени выполнения задач
3. Валидация всех AI команд через JSON Schema
4. Fallback к базовым правилам при сбоях AI
5. Ограничения на опасные действия (лава, высота, атака игроков)
6. Rate limiting на команды

## 📚 Документация и запуск

### Локальный запуск

```bash
npm install
npm run dev
```

### Настройка окружения

- Все переменные находятся в `.env` (пример: `config/.env.example`).

**Примеры команд**

- `:follow <player>` — следовать за игроком
- `stop` — остановить действия
- `farm` — начать фермерство

## 🛣 Roadmap

1. Веб-интерфейс для мониторинга и управления
2. Интеграция с Discord для удалённого управления
3. Поддержка нескольких ботов с распределением ролей
