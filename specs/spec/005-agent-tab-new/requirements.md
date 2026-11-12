# Requirements: Agent test (no-op request)

**Branch**: `spec/005-agent-tab-new` | **Date**: 2026-11-12 | **Loop**: 1 | **Attempt**: `ss_spec_005-agent-tab-new_1794462113809_0`
**Source**: inline request bound by the pipeline (`request`, kind `text`, sha256 `faecd60eb42aaf29c08aed4eee076169f966834368cbba999bb2eb9fc71fb476`):

> "Nothing just for agent test"

No requirements document, planning item or design brief was bound (all `null`). The request text is the sole requirement source and is treated as complete.

## Derived requirements

| ID | Requirement | Source | Acceptance |
|----|-------------|--------|------------|
| **R-001** | The feature makes **no change** to the `terminal-portfolio` repository: no application code, no harness edits (`AGENTS.md`, `README.md`, `prompt`, `CLAUDE-import.md`), no `devos.env.yaml` — unless a person explicitly decides otherwise (see Q-001). | Request: "Nothing" | **AC-001** `git -C terminal-portfolio diff --stat main...spec/005-agent-tab-new` prints nothing (no branch is published for that repository). |
| **R-002** | The planning step produces the four bound artifacts (`plan.md`, `research.md`, `requirements.md`, `task-plan.json`) under `specs/spec/005-agent-tab-new/`, mutually consistent: every task in `task-plan.json` cites requirement IDs defined here, `task-plan.json` is valid `schemaVersion: 1` JSON with an acyclic `dependsOn` graph. | Request: "just for agent test" — the test exercises the pipeline, so the artifacts *are* the deliverable | **AC-002** All four files exist; `python3 -I -c 'import json; json.load(open("specs/spec/005-agent-tab-new/task-plan.json"))'` exits 0; every `tasks[].acceptanceCriteria` entry references an `AC-*`/`R-*` ID that appears in this document. |
| **R-003** | The pipeline outcome for a no-op request is decided by a person, because the pinned pipeline's downstream gates (`implement` ready_requires `integration`, `e2e`; `validate` requires `unit`, `lint`, `integration`, `e2e`) cannot be satisfied on a repository that contains no code and no check recipe, and the repository cannot waive those checks itself. | `devos gates` (pinned graph); `static-gate.sh` applicability rule (a committed `applicability: {required: false}` is only honoured for checks the pipeline pins as not required) | **AC-003** Q-001 is answered by a `factory_member` and recorded in `task-plan.json` (`openQuestions[Q-001]` resolved) before any implementation starts. |

## Assumptions

- **A-1** "Nothing" is literal: the person wants to see the agent pipeline run, not a product change. The harness documents in `terminal-portfolio` are not to be touched.
- **A-2** The `prompt` file in the repository (a sample "Test User / green phosphor" generation prompt) is sample content for human use, **not** a bound input to this feature; it does not imply a request to generate the portfolio.
- **A-3** No factory or repository constitution exists (`.hub/.specify/memory/constitution.md` and `terminal-portfolio/.specify/memory/constitution.md` are absent), so there are no governing principles to check beyond the pipeline's own gates.
- **A-4** No data services, migrations or fresh-state criteria are involved; nothing here needs `data.isolation: fresh` or preparation tasks (`none: true`).

## Unresolved questions

| ID | Question | Blocking | Options |
|----|----------|----------|---------|
| **Q-001** | What should this agent test conclude with, given the request asks for nothing and the pinned gates require unit/lint/integration/e2e evidence from a repository with no code? | **Yes** (blocks any route beyond `plan`) | **A (recommended)** — Treat the plan artifacts as the test's deliverable; end the run here (no implementation, no branch on `terminal-portfolio`). **B** — Turn the test into a real feature: bootstrap the minimal verifiable reference app described by `AGENTS.md` (generation recipe steps 1–5) with a published `devos.env.yaml` so every gate can be exercised; this should be re-requested as its own feature with identity data (name, handle, palette) supplied. **C** — A platform owner re-pins this pipeline so `unit`, `lint`, `integration`, `e2e` are not required for the test; the repository cannot do this from `devos.env.yaml`. |

## Out of scope

- Generating the portfolio application, choosing a palette, editing the harness, or adding dependencies — none of these are requested.
- Any visual design work: the harness already fixes the entire visual system; the request carries no UI behaviour.
