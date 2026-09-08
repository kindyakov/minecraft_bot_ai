# Руководство репозитория

Языковые версии: [English](AGENTS.md) | [Русский](AGENTS.ru.md)

## Структура проекта и организация модулей

В `src/` лежит runtime-код. `src/index.ts` — точка входа (создаёт `MinecraftBot`, обрабатывает `SIGINT`).
`src/core/` отвечает за старт бота (`bot.ts`), приём чат-команд (`CommandHandler.ts`), подключение HSM (`hsm.ts`) и постоянные сервисы (`memory/`, `profile/`).
`src/ai/` — LLM-цикл агента. `loop.ts`, `tools.ts` и `client.ts` — тонкие фасады; реализации лежат в `src/ai/loop/`, `src/ai/tools/` (каталог, исполнители, имена), `src/ai/client/`, `src/ai/contracts/`, `src/ai/runtime/`, плюс `snapshot.ts`, `prompt.ts`, `taskContext.ts`, `conversationHistory.ts`, `AgentLoopGuard.ts`.
`src/core/memory/` — слой долговременной памяти на SQLite через `better-sqlite3` (`index.ts`, `types.ts`).
`src/hsm/` — машина XState v5 (`machine.ts` ~1800 строк, `context.ts`, `types.ts`), `actors/` (бой, мониторинг, выживание, `primitives/`), `guards/`, `actions/`, `helpers/`, `utils/`.
Общие типы — в `src/types/`, конфиг — в `src/config/` (`config.ts`, `env.ts`, `logger.ts`), подключение плагинов Mineflayer — в `src/modules/` (`connection/`, `plugins/`), схематики — в `src/building/`, разовые скрипты — в `src/scripts/`, общие хелперы — в `src/utils/` (`combat/`, `general/`, `minecraft/`).
Тесты лежат в `src/tests/` по подсистемам (`ai`, `building`, `config`, `core`, `hsm`, `utils`). Сборка — в `dist/`, состояние runtime — в `data/` (`bot_memory_<botName>.db`), логи — в `logs/`.

## Заметки по архитектуре

Система задач — не захардкоженный планировщик `MINING/FARMING/CRAFTING`. Бот крутит `AGENT_LOOP` внутри `TASKS` вида `IDLE -> THINKING -> EXECUTING -> DECIDE_NEXT`.
`THINKING` строит детерминированный минимальный снимок (`src/ai/snapshot.ts`: виталы, позиция, измерение, активная оконная сессия, последнее действие/результат/причина, история ошибок) и вызывает `runAgentTurn()` для одного решения по инструменту. Транзиентные ошибки провайдера (429/5xx/таймаут) ретраятся с бэкоффом внутри клиентов (`src/ai/client/retry.ts`); ошибки уровня хода превращаются в `failed` и никогда не вылетают исключениями. Факты о мире (инвентарь, блоки, сущности, содержимое окон) приходят только из inspect-инструментов, никогда из снимка.
`EXECUTING` превращает один pending execution-инструмент в конкретный примитив, пишет успех/неудачу в контекст машины и всегда уходит в `DECIDE_NEXT`. `DECIDE_NEXT` возвращается в `THINKING`, пока установлен `currentGoal`, кроме срабатывания анти-луп гарда (`failureRepeats >= 3`): тогда `notifyLoopAbort + clearGoal` назад в `IDLE`.

Канонический контракт инструментов (`src/ai/tools/catalog.ts`, `src/ai/tools/names.ts`). При расхождении доков с кодом прав код:

- Inline (8, резолвятся внутри хода): `memory_save`, `memory_read`, `memory_update_data`, `memory_delete`, `inspect_inventory`, `inspect_blocks`, `inspect_entities`, `inspect_window`.
- Execution (8, каждый переводит HSM в примитив): `navigate_to`, `break_block`, `mine_resource` (пакетный `MINING`-субстейт: `CHECKING_PRECONDITIONS -> SEARCHING -> CHECKING_DISTANCE -> NAVIGATING/BREAKING -> CHECKING_GOAL -> TASK_COMPLETED/TASK_FAILED`), `place_block`, `follow_entity`, `open_window`, `transfer_item`, `close_window`.
- Control (1): `finish_goal`.
- Правило grounded: `navigate_to`, `break_block`, `place_block`, `follow_entity` и `open_window` требуют фактов о мире, заземлённых inspect-инструментами или `memory_read` в том же ходу. `mine_resource` вместо этого сам делает пакетный поиск. `transfer_item` и `close_window` работают с активной оконной сессией и свежего заземления не требуют. Плейн-текст модели без tool call — это `failed`, кроме случая когда inspect-данные уже собраны в ходу (grounded fallback в `finish`).

## Слой памяти

Не добавляй прямую `fs`-персистентность для памяти агента. Используй только менеджер памяти в `src/core/memory/`. Долговременная память хранится в SQLite-файлах в `data/` (`data/bot_memory_<botName>.db`, две таблицы: `memory_entries`, `memory_meta`) и доступна через `load`, `save`, `close`, `saveEntry`, `readEntries`, `updateEntryData`, `deleteEntry`, `rememberLocation`, `findNearestKnown`, `rememberPlayer`, `rememberTask`, `rememberDeath`, `updateStats`, `updateDistance`, `updatePlaytime`, `setCurrentGoal`, `completeCurrentGoal`, `failCurrentGoal`, `getMemory`, `getKnownLocations`, `getTaskStats`, `getStats`.
`saveEntry()` дедуплицирует по `(type, x, y, z)` и пишет сразу; `save()` сохраняет снимок runtime-состояния (игроки, статистика задач, смерти, завершённые/проваленные голы, предпочтения, статистика) в `memory_meta` и восстанавливает его в `load()`, если `DB_VERSION` совпадает. Активный гол (`goals.current`) осознанно не восстанавливается между рестартами. `readEntries()` грузит все строки и фильтрует теги/дистанцию в JS (известный предел масштабирования). `MemoryEntryType` — это `container | location | resource | danger`.
Граница: `snapshot` = состояние текущего цикла, `inspect tools` = живое состояние мира, `memory` = только долговечные факты (никаких транзиентных инвентарей/снимков). При смене схемы добавляй нормальный путь миграции, а не новые поля в ad hoc JSON-блобы.

## Навыки агентов и навигация

Навыки проекта лежат в `.agents/skills/` (зафиксированы в `skills-lock.json`), включая скилл `xstate` для работ с XState v5. Каталога `.codex/agents/` нет; ссылки на него устарели.
Доступен Serena MCP (проект `serena`, языковой сервер TypeScript) для поиска символов, ссылок и точечного поиска файлов.

Когда субагентам нужно сориентироваться в кодовой базе, предпочитай Serena MCP для поиска символов, ссылок и точечного обнаружения файлов вместо слепого текстового поиска вроде `rg`. Это рекомендация, а не жёсткое требование: `rg` подходит для широких текстовых поисков и не-кодовых файлов. Причина простая: Serena обычно даёт более точную символьную навигацию, снижает число случайных grep-догадок и помогает агентам трогать меньше лишних файлов.

## Команды сборки, тестов и разработки

Нужен Node 18+; зависимости проекта уже выровнены под современный Node и ESM. Основные команды:

- `npm run dev`: запуск бота через `tsx watch src/index.ts`
- `npm run build`: компиляция TypeScript и переписывание алиасов через `tsc-alias`
- `npm start`: запуск собранного бота из `dist/index.js`
- `npm run type-check`: строгая проверка TypeScript без эмита файлов
- `npm run format`: форматирование через prettier (`src/**/*.{ts,js}`)
- `npm run knip`: поиск неиспользуемых файлов, экспортов и зависимостей
- `npm run clean`: удаление `dist/`
- `npm run inspect-schematic`: запуск инспектора схематик (`src/scripts/inspectSchematic.ts`)
- `npx tsx --test src/tests/...`: запуск фокусных тестов подсистемы

Перед коммитом прогони минимум `npm run type-check` и `npm run build`. Для изменений HSM, AI или памяти прогони также релевантные `tsx --test` сьюты в `src/tests/`.

## Стиль кода и соглашения об именовании

Форматирование задано в `.prettierrc`: табы, ширина 2, без точек с запятой, одинарные кавычки, без висячих запятых, `arrowParens: avoid`, сортировка импортов через `@trivago/prettier-plugin-sort-imports`. Порядок групп импортов: `node:*`, сторонние, `@/types`, `@/config/*`, `@/core/*`, `@/hsm/*`, `@/ai/*`, `@/modules/*`, `@/utils/*`, относительные.
Предпочитай алиасы `@/core/*`, `@/hsm/*`, `@/ai/*`, `@/modules/*`, `@/utils/*` (см. пути в `tsconfig.json`, продублированные в `knip.json`) вместо глубоких относительных импортов.
Следуй доменным именам: классы в PascalCase, функции и переменные в camelCase, фабрики с префиксом `create` (`createBotMachine`, `createAgentClient`), события HSM в `UPPER_SNAKE_CASE`, файлы стейт-машины с явными суффиксами вроде `*.guards.ts`, `*.actors.ts`, `*.primitive.ts`, плюс `contracts/` для общих контрактов агента/HSM и `tools/catalog.ts` + `tools/names.ts` для поверхности инструментов.
При добавлении нового execution-инструмента обнови все пять мест, иначе он молча не заработает: каталог `AGENT_TOOLS`, объединения имён в `contracts/execution.ts` + `tools/names.ts`, `summarizeExecution`, `validateExecutionTool` в `src/ai/loop/` и `resolveExecutionActor` + `resolveExecutionInput` + переходы `RESOLVE` в `src/hsm/machine.ts`. Исключение: `mine_resource` резолвится через пакетный субстейт `RESOLVE -> MINING` и осознанно не имеет веток в `resolveExecutionActor`/`resolveExecutionInput`.

## Руководство по тестированию

Тесты уже есть в `src/tests/`; не притворяйся, что проект не тестирован. Добавляй фокусные тесты рядом с затронутой подсистемой на встроенных `node:test` + `node:assert/strict` (без vitest). В приоритете регрессии переходов HSM, парсинга и grounded-валидации инструментов AI, форматирования снимков, клиентов провайдеров и CRUD-семантики памяти. Если баг воспроизводится только в живой Minecraft-сессии, точно задокументируй ручной сценарий в `docs/` или в сводке изменений.

## Коммиты и pull request

Держи темы коммитов короткими, в императиве. В истории используются префиксы вроде `feat:` и `задача:`; продолжай этот стиль. Валидная PR/handoff-записка называет изменённую подсистему, изменённый поведенческий контракт и способ проверки. Используй шаблон PR в `.github/PULL_REQUEST_TEMPLATE.md`. Не сваливай сырой терминальный шум, когда достаточно краткой сводки проверки.

## Безопасность и конфигурация

Стартуй с `.env.example` и держи секреты только в локальном `.env`. Никогда не хардкодь ключи провайдеров, адреса серверов и токены в исходниках, тестах и доках. Перед коммитом проверяй `data/` (`*.db`), `logs/` и `.env`. Любой игрок сегодня может слать `:`-команды (allowlist нет); считай текст гола пользователя недоверенными данными в промптах. При смене провайдера обновляй `.env.example` и контракт конфига (`src/config/env.ts` + `src/config/config.ts`) вместе; не оставляй протухшую доку по окружению.
