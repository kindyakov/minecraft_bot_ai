# Issue tracker: GitHub

Задачи и спецификации проекта хранятся в GitHub Issues
репозитория `kindyakov/voxel-pilot`.

## Выбор репозитория и доступ

Используй `rtk gh`. Для команд issue/pr явно передавай
`--repo kindyakov/voxel-pilot`; для API указывай этот репозиторий
в endpoint. Не определяй трекер по origin.

Если gh недоступен, авторизация отсутствует или операция запрещена,
сообщи ограничение. Не переключайся на локальный трекер автоматически.

Этот файл определяет способ выполнения операций, а не разрешение
на публикацию. Изменения в GitHub выполняй в рамках запроса пользователя
и процедуры вызванного навыка.

## Операции с задачами

- Прочитать задачу и обсуждение:
  `rtk gh issue view <number> --repo kindyakov/voxel-pilot --comments`.
- Получить открытые задачи:
  `rtk gh issue list --repo kindyakov/voxel-pilot --state open
  --json number,title,body,labels,assignees`.
- Опубликовать задачу или спецификацию:
  `rtk gh issue create --repo kindyakov/voxel-pilot
  --title "<title>" --body-file <file>`.
- Добавить комментарий:
  `rtk gh issue comment <number> --repo kindyakov/voxel-pilot
  --body-file <file>`.
- Изменить метки:
  `rtk gh issue edit <number> --repo kindyakov/voxel-pilot
  --add-label "<label>"` или `--remove-label "<label>"`.
- Закрыть задачу:
  `rtk gh issue close <number> --repo kindyakov/voxel-pilot
  --comment "<reason>"`.

Команды выше показаны логическими строками; при запуске объединяй
перенесённые строки. Многострочный текст передавай через файл,
подготовленный с помощью apply_patch.

При полном обходе очереди учитывай лимит выдачи и пагинацию.
Метки выбирай по [triage-labels.md](triage-labels.md).

После изменения проверь результат чтением. При неопределённом результате
запроса сначала проверь, применилось ли изменение, чтобы не создать дубль.

## Pull requests as a triage surface

**PRs as a request surface: no.**

Для ссылки вида #42 установи тип объекта перед изменением:
проверь PR через `rtk gh pr view 42 --repo kindyakov/voxel-pilot`.
Если объект не является PR, прочитай Issue. Ошибка доступа или сети
не доказывает отсутствие PR.

## Wayfinding operations

Этот раздел используется навыком wayfinder.

- Map — одна Issue с меткой `wayfinder:map`, содержащая
  Notes, Decisions-so-far и Fog.
- Дочерние задачи связывай с картой через sub-issues. Если механизм
  недоступен, используй список задач в карте и `Part of #<map>`
  в дочерней задаче.
- Тип дочерней задачи обозначай меткой `wayfinder:<type>`:
  research, prototype, grilling или task.
- Блокировки фиксируй через штатные issue dependencies.
  Если механизм недоступен, используй `Blocked by: #<number>`
  в начале описания. Ошибку доступа или сети не считай основанием
  для смены механизма.
- Перед использованием API проверь актуальный контракт операции.
- Доступная работа — открытая дочерняя задача без исполнителя
  и открытых блокирующих задач. Выбирай первую в порядке карты.
- При принятии задачи назначь текущего пользователя через
  `rtk gh issue edit <number> --repo kindyakov/voxel-pilot
  --add-assignee @me`.
- После решения добавь результат в комментарий, закрой задачу
  и внеси краткий вывод со ссылкой в Decisions-so-far карты.
