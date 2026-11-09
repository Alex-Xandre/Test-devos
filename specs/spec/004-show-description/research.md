# Research: 004-show-description

**Branch**: `spec/004-show-description` | **Rigor**: light

## Codebase state (inspected)

- `/workspace/terminal-portfolio` is a git repository on `spec/004-show-description`, clean, base `main`.
- Tracked files: `AGENTS.md`, `CLAUDE-import.md` (`@AGENTS.md`), `README.md`, `prompt`. History is four commits. The last is `32190a9` ("harness v1.1: shell, live ticker, 404, projects format rule").
- No `package.json`, `src/`, `app/`, `public/`, `devos.env.yaml`, lint or test configuration.
- `/workspace/.hub` is the hub repository. It holds `specs/` (empty aside from this feature), `designs/` (empty), and `.specify/templates/`. There is no constitution file at `.hub/.specify/memory/constitution.md`, so the constitution check cannot be performed against a real document.
- `devos gates` reports `unit`, `lint`, `integration`, `e2e` as required and `typecheck`, `build` as optional, all unavailable for `terminal-portfolio`. Declared checks: none.

## Harness findings relevant to description display

| Topic | Location | Finding |
|---|---|---|
| Project data shape | `AGENTS.md:142-143` | Projects carry `description`, `features[]`, `stack[]`, `type`, optional `year`, `github`. |
| Typography for descriptions | `AGENTS.md:27-30` | Descriptions use IBM Plex Sans (`font-sans`); chrome uses mono. |
| Project row pattern | `AGENTS.md:202-211` | Bordered raised block; description sans; stack chips; `year` omitted when absent. |
| Projects format rule | `AGENTS.md:293-296` | Window-chrome cards only when real screenshots exist; otherwise `ls`-style text rows. Placeholder screenshots are forbidden. |
| Shell output | `AGENTS.md:274-291` | Interactive shell commands return `lines`; a `ls`-style listing could carry descriptions. |
| Consistency | `AGENTS.md:304-314` | Build and typecheck must pass before commit. |

## Alternatives considered

1. **Show description in project rows only.** Smallest change, reuses the row pattern. Chosen as the default recommendation, pending Q1.
2. **Show description on the detail page with window chrome.** Requires a screenshot. This is excluded by the format rule unless the project has real screenshots (`AGENTS.md:293-296`).
3. **Add a new description field distinct from `description`.** Rejected by default. The harness already defines `description`, and a second field would create a consistency risk (`AGENTS.md:304-306`).

## Design route

Visual design is not needed for the default recommendation. The row pattern, typography and tokens are already specified in the harness (`AGENTS.md:202-211`, `AGENTS.md:29`, `AGENTS.md:51-75`). If Q1 selects a new layout, the design route should be reconsidered.

## Unknowns carried forward

- Q1 and Q2 (see `requirements.md`).
- Checks cannot be planned concretely until a scaffold exists. Command, runner and cwd are unknown.
