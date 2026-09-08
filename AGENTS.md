# Repository Guidelines

Language versions: [English](AGENTS.md) | [Русский](AGENTS.ru.md)

## Project Structure & Module Organization

`src/` contains the runtime code. `src/index.ts` is the entrypoint (creates `MinecraftBot`, handles `SIGINT`).
`src/core/` owns bot bootstrap (`bot.ts`), chat command ingestion (`CommandHandler.ts`), HSM wiring (`hsm.ts`), and persistent services (`memory/`, `profile/`).
`src/ai/` contains the LLM agent loop. `loop.ts`, `tools.ts`, and `client.ts` are thin facades; implementations live in `src/ai/loop/`, `src/ai/tools/` (catalog, executors, names), `src/ai/client/`, `src/ai/contracts/`, `src/ai/runtime/`, plus `snapshot.ts`, `prompt.ts`, `taskContext.ts`, `conversationHistory.ts`, `AgentLoopGuard.ts`.
`src/core/memory/` is the long-term memory layer backed by SQLite via `better-sqlite3` (`index.ts`, `types.ts`).
`src/hsm/` contains the XState v5 machine (`machine.ts` ~1800 lines, `context.ts`, `types.ts`), `actors/` (combat, monitoring, survival, `primitives/`), `guards/`, `actions/`, `helpers/`, `utils/`.
Shared typings live in `src/types/`, config in `src/config/` (`config.ts`, `env.ts`, `logger.ts`), Mineflayer plugin wiring in `src/modules/` (`connection/`, `plugins/`), schematics in `src/building/`, one-off scripts in `src/scripts/`, generic helpers in `src/utils/` (`combat/`, `general/`, `minecraft/`).
Tests live under `src/tests/` grouped by subsystem (`ai`, `building`, `config`, `core`, `hsm`, `utils`). Build output goes to `dist/`, runtime state to `data/` (`bot_memory_<botName>.db`), and logs to `logs/`.

## Architecture Notes

The task system is not a hardcoded `MINING/FARMING/CRAFTING` planner. The bot runs an `AGENT_LOOP` inside `TASKS` with the shape `IDLE -> THINKING -> EXECUTING -> DECIDE_NEXT`.
`THINKING` builds a deterministic minimal snapshot (`src/ai/snapshot.ts`: vitals, position, dimension, active window session, last action/result/reason, error history) and calls `runAgentTurn()` for one tool decision. World facts (inventory, blocks, entities, window contents) come only from inspect tools, never from the snapshot.
`EXECUTING` resolves one pending execution tool to a concrete primitive state, records success/failure into machine context, and always goes to `DECIDE_NEXT`. `DECIDE_NEXT` returns to `THINKING` while `currentGoal` is set, unless the anti-loop guard (`failureRepeats >= 3`) aborts the run via `notifyLoopAbort + clearGoal` back to `IDLE`.

Canonical tool contract (`src/ai/tools/catalog.ts`, `src/ai/tools/names.ts`). Code wins over docs when they disagree:

- Inline (8, resolve inside the turn): `memory_save`, `memory_read`, `memory_update_data`, `memory_delete`, `inspect_inventory`, `inspect_blocks`, `inspect_entities`, `inspect_window`.
- Execution (8, each transitions the HSM into a primitive): `navigate_to`, `break_block`, `mine_resource` (batch `MINING` sub-state: `CHECKING_PRECONDITIONS -> SEARCHING -> CHECKING_DISTANCE -> NAVIGATING/BREAKING -> CHECKING_GOAL -> TASK_COMPLETED/TASK_FAILED`), `place_block`, `follow_entity`, `open_window`, `transfer_item`, `close_window`.
- Control (1): `finish_goal`.
- Grounded rule: `navigate_to`, `break_block`, `place_block`, `follow_entity`, and `open_window` need world facts grounded by inspect tools or `memory_read` in the same turn. `mine_resource` performs its own batch search instead. `transfer_item` and `close_window` operate on the active window session and need no fresh grounding. Plain-text model output without a tool call is `failed`, unless inspect data was already gathered in the turn (grounded fallback to `finish`).

## Memory Layer

Do not add direct `fs` persistence for agent memory. Use the memory manager under `src/core/memory/` only. Persistent memory is stored in SQLite files under `data/` (`data/bot_memory_<botName>.db`, two tables: `memory_entries`, `memory_meta`) and accessed through `load`, `save`, `close`, `saveEntry`, `readEntries`, `updateEntryData`, `deleteEntry`, `rememberLocation`, `findNearestKnown`, `rememberPlayer`, `rememberTask`, `rememberDeath`, `updateStats`, `updateDistance`, `updatePlaytime`, `setCurrentGoal`, `completeCurrentGoal`, `failCurrentGoal`, `getMemory`, `getKnownLocations`, `getTaskStats`, `getStats`.
`saveEntry()` deduplicates by `(type, x, y, z)` and writes immediately; `save()` persists the runtime state snapshot (players, task stats, deaths, completed/failed goals, preferences, stats) into `memory_meta` and restores it on `load()` when `DB_VERSION` matches. The active goal (`goals.current`) is deliberately not restored across restarts. `readEntries()` loads all rows and filters tags/distance in JS (known scaling limit, see planning concerns). `MemoryEntryType` is `container | location | resource | danger`.
Boundary: `snapshot` = current cycle state, `inspect tools` = live world state, `memory` = durable facts only (no transient inventory/snapshot data). If the schema changes, add a proper migration path instead of bolting new fields onto ad hoc JSON blobs.

## Agent Skills & Navigation

Project skills live in `.agents/skills/` (pinned by `skills-lock.json`), including the `xstate` skill for XState v5 work. There is no `.codex/agents/` directory; references to it are stale.
Serena MCP (`serena` project, TypeScript language server) is available for symbol lookup, references, and targeted file discovery.

When subagents need to orient themselves in the codebase, prefer Serena MCP for symbol lookup, references, and targeted file discovery before falling back to plain text search such as `rg`. This is a recommendation, not a hard requirement: `rg` is still fine for broad text hunts or non-code files. The reason is simple: Serena usually gives more precise symbol-level navigation, reduces accidental grep-driven guesses, and helps agents touch fewer irrelevant files.

## Build, Test, and Development Commands

Use Node 18+; current project dependencies are already aligned with modern Node and ESM. Core commands:

- `npm run dev`: run the bot with `tsx watch src/index.ts`
- `npm run build`: compile TypeScript and rewrite path aliases with `tsc-alias`
- `npm start`: run the compiled bot from `dist/index.js`
- `npm run type-check`: strict TypeScript validation without emitting files
- `npm run format`: format with prettier (`src/**/*.{ts,js}`)
- `npm run knip`: detect unused files, exports, and dependencies
- `npm run clean`: remove `dist/`
- `npm run inspect-schematic`: run the schematic inspector (`src/scripts/inspectSchematic.ts`)
- `npx tsx --test src/tests/...`: run focused subsystem tests

Before committing, run at least `npm run type-check` and `npm run build`. For HSM, AI, or memory changes, also run the relevant `tsx --test` suites under `src/tests/`.

## Coding Style & Naming Conventions

Formatting is defined by `.prettierrc`: tabs, width 2, no semicolons, single quotes, no trailing commas, `arrowParens: avoid`, import sorting via `@trivago/prettier-plugin-sort-imports`. Import group order: `node:*`, third-party, `@/types`, `@/config/*`, `@/core/*`, `@/hsm/*`, `@/ai/*`, `@/modules/*`, `@/utils/*`, relative.
Prefer path aliases `@/core/*`, `@/hsm/*`, `@/ai/*`, `@/modules/*`, `@/utils/*` (see `tsconfig.json` paths, mirrored in `knip.json`) over deep relative imports.
Follow existing domain naming: classes in PascalCase, functions and variables in camelCase, factories prefixed with `create` (`createBotMachine`, `createAgentClient`), HSM events in `UPPER_SNAKE_CASE`, and state-machine files with explicit suffixes such as `*.guards.ts`, `*.actors.ts`, `*.primitive.ts`, plus `contracts/` for shared agent/HSM contracts and `tools/catalog.ts` + `tools/names.ts` for the tool surface.
When adding a new execution tool, update all five places or it fails silently: `AGENT_TOOLS` catalog, tool-name unions in `contracts/execution.ts` + `tools/names.ts`, `summarizeExecution`, `validateExecutionTool` in `src/ai/loop/`, and `resolveExecutionActor` + `resolveExecutionInput` + `RESOLVE` transitions in `src/hsm/machine.ts`. Exception: `mine_resource` resolves via the `RESOLVE -> MINING` batch sub-state and intentionally has no `resolveExecutionActor`/`resolveExecutionInput` branch.

## Testing Guidelines

Tests already exist in `src/tests/`; do not pretend the project is untested. Add focused tests next to the affected subsystem directory with Node's built-in `node:test` + `node:assert/strict` (no vitest). Prioritize regression tests for HSM transitions, AI tool parsing and grounding validation, snapshot formatting, provider clients, and memory CRUD semantics. If a bug only reproduces in the live Minecraft session, document the manual scenario precisely in `docs/` or in the change summary.

## Commit & Pull Request Guidelines

Keep commit subjects short and imperative. Existing history uses prefixes like `feat:` and `задача:`; continue that style. A valid PR or handoff note should state which subsystem changed, what behavioral contract changed, and how it was verified. Use the PR template in `.github/PULL_REQUEST_TEMPLATE.md`. Do not dump raw terminal noise when a concise verification summary is enough.

## Security & Configuration Tips

Start from `.env.example` and keep secrets only in local `.env`. Never hardcode provider keys, server addresses, or tokens in source files, tests, or docs. Review `data/` (`*.db`), `logs/`, and `.env` before committing. Any player can send `:` chat commands today (no allowlist); treat user goal text as untrusted data in prompts. If you rotate model providers, update `.env.example` and the config contract (`src/config/env.ts` + `src/config/config.ts`) together; do not leave stale environment documentation behind.
