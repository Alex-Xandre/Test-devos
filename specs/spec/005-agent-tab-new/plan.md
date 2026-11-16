# Implementation Plan: Agent test (no-op request)

**Branch**: `spec/005-agent-tab-new` | **Date**: 2026-11-16 | **Spec**: `requirements.md` (derived from the inline request)
**Input**: inline request "Nothing just for agent test" (sha256 `faecd60e…`, verified), parameters `rigor: light`, `design: optional`
**Loop / attempt**: 1 / `ss_spec_005-agent-tab-new_1794848839188_0`

## Summary

The request asks for no change. The planning artifacts are the deliverable of this "agent test" (R-002); the `terminal-portfolio` repository stays untouched (R-001); downstream steps report the pipeline-required checks as unavailable because the repository has no code and no recipe, and must not fake them (R-003); and the person confirms or rejects this no-op outcome at the plan's after-approval gate (R-004). **Result of this step: `done`**, routing to `implement` with an empty work package (no design needed). This replaces the previous attempt's `needs_human` on Q-001, which received no answer — the approval gate is the supplied contract for that decision (research §3).

## Technical Context

**Language/Version**: none present. `AGENTS.md` prescribes Next.js (App Router) + Tailwind v4 + TypeScript for the future reference app.
**Primary Dependencies**: none installed (`git ls-files`: `AGENTS.md`, `CLAUDE-import.md`, `README.md`, `prompt`).
**Storage**: N/A.
**Testing**: none exists; no `devos.env.yaml` in `terminal-portfolio/` (`recipe publish` → "devos.env.yaml is missing"); `.hub/devos.env.yaml` absent (nothing composes a preview).
**Target Platform**: static site on Vercel (per README) — only relevant under Option B.
**Project Type**: harness-only repository.
**Constraints**: `AGENTS.md` non-negotiable rules bind any future code; "most bugs in this codebase are additions".
**Scale/Scope**: zero code change requested.

## Constitution Check

No constitution exists at `.hub/.specify/memory/constitution.md` or `terminal-portfolio/.specify/memory/constitution.md` (assumption A-3). There are no governing principles or accepted ADRs to check; the only governing rules are the pipeline gates recorded in `research.md` §2. Nothing in this plan keys on a step id, pipeline name, agent ref, repository or person. No violations → Complexity Tracking is empty.

## Decisions

| ID | Decision | Evidence | Cited by |
|----|----------|----------|----------|
| D-1 | Build nothing; keep `terminal-portfolio` unchanged. | request text; `research.md` §1 | R-001 |
| D-2 | Required checks stay **unavailable**: no recipe, stub or exit-zero placeholder is authored; implement declares them unavailable with the recipe-missing reason verbatim. | `devos gates`; `static-gate.sh:192-193`; `research.md` §2 | R-003 |
| D-3 | Complete with `done`; Q-001 resolves to A with the after-approval gate as the person's decision point, instead of a second `needs_human`. | `research.md` §3; gate `plan.approval {when: after}` | R-004, Q-001 |
| D-4 | Design routing: **not required** (`designRequired: false`) → `implement`. The request has no UI behaviour; `AGENTS.md` already fixes every visual decision even for Option B. Recorded for the person's review. | `research.md` §4 | — |
| D-5 | Option B (minimal verifiable reference app) is sketched with concrete check contracts for the approver's judgement but has **no tasks** in `task-plan.json`; it needs a re-request with identity data. | `AGENTS.md` generation recipe; `research.md` §5 | Q-001 |

No proposed ADRs: none of the above is an architectural decision of lasting significance to the repository.

## Project Structure

### Documentation (this feature)

```text
specs/spec/005-agent-tab-new/
├── plan.md              # this file
├── research.md          # unknowns and evidence
├── requirements.md      # R-001..R-004, AC-001..AC-004, Q-001
└── task-plan.json       # executable task plan (status: ready)
```

No `data-model.md`, `contracts/` or `quickstart.md`: the feature has no data, no interfaces and nothing to run. No `merge-order.json`: only the hub repository changes (planning documents); `terminal-portfolio` receives no branch.

### Source Code

Unchanged. Under Option B only, the layout would follow `AGENTS.md`/`README.md`: `src/app/globals.css`, `src/app/layout.tsx`, `src/lib/site.ts`, `src/components/{appbar,ticker,hero}.tsx`, `tests/unit/`, `tests/integration/`, `tests/e2e/`, `devos.env.yaml`.

## Interfaces, state, errors, migration, deployment, rollback

Not applicable: no interface, state transition, migration, deployment or rollback exists. Rollback of this step is deleting `specs/spec/005-agent-tab-new/` in the hub.

## Design routing

`design: optional` → **implement** (D-4). Reason: no visual behaviour is requested and the harness pre-decides all visuals. The caller owns subsequent routing; the implement step receives an empty work package and only the proof tasks T-001..T-002 below.

## Acceptance-to-test matrix

| ID | Boundary | Setup | Observable assertion | Environment | Automated evidence | Owner |
|----|----------|-------|----------------------|-------------|--------------------|-------|
| AC-001 | CLI, target-free | checkout of `terminal-portfolio` on the feature branch | `git -C terminal-portfolio diff --stat main...HEAD` prints nothing, exit 0 | any pod with the repository mounted | `V-001` (output captured as step evidence; the platform's own "no branch published" record) | plan (now); implement (re-run at close-out) |
| AC-002 | CLI, target-free | hub checkout | four bound files exist; `task-plan.json` parses, `schemaVersion == 1`, `dependsOn` acyclic, every cited `AC-*`/`R-*` ID exists in `requirements.md` | any pod | `V-002` (python3 -I one-liner) | plan (now) |
| AC-003 | CLI, target-free | `terminal-portfolio` checkout | `recipe publish` exits non-zero with "devos.env.yaml is missing"; `git ls-files devos.env.yaml` prints nothing; implement's declared evidence for `unit`/`lint`/`integration`/`e2e` is `unavailable` with that reason | any pod | `V-003` (command output); implement's gate record | implement |
| AC-004 | human decision | the person reads this plan | a `factory_member` approves or rejects at the after-approval gate | devOS UI | none possible — explicitly a person's decision; the only `[human]` item | factory_member |

No unit, integration or E2E check applies to a no-op; no third-party stand-ins; no mocking.

## Planned check contracts and ownership

**Planned result (Option A)** — no `devos.env.yaml` check is authored or published; nothing executes against `terminal-portfolio`. V-001..V-003 are plain commands (cwd `/workspace`, no runtime beyond git/python3, no setup, no target, no secrets, no preview, no browser), recorded in `task-plan.json`. The pipeline-required checks remain **unavailable** and are declared so by implement (T-002) — not pass, not pre-existing debt. No `data.isolation: fresh` criterion exists; preparation is `none: true`.

**Only if the approver rejects and re-requests Option B** (owner for all of these: the `implement` step of that new feature; no separate test author is supplied, so implement writes the tests first and publishes the recipe with `recipe publish` before any check runs; Node and Chromium availability must be proven before test authoring):

| Check | Runner / command | Runtime | cwd | Setup | Target | Report | Collection | Acceptance IDs (to be defined in the re-specified feature) |
|-------|------------------|---------|-----|-------|--------|--------|------------|-----|
| `unit` | `npx vitest run --reporter=junit --outputFile=${run:evidence}/junit.xml` | Node 20+ | `terminal-portfolio` | `npm ci` | none | `junit-xml`; identity = runner `vitest`, suite = file path, class = describe scope, case = test title; skip policy: `test.skip`/`todo` reported as skipped, never omitted | `npx vitest list --json` | pure helpers (`site.ts` constants, list-date `${year}-${month}` rule) |
| `lint` | `npx eslint . -f junit -o ${run:evidence}/eslint.xml` | Node | `terminal-portfolio` | `npm ci` | none | `junit-xml` (one case per file/rule) | n/a — no collection API; branch-addition attribution unknown without base/head manifests | lint-clean |
| `typecheck` (optional) | `npx tsc --noEmit` | Node | `terminal-portfolio` | `npm ci` | none | command-level receipt only | n/a | `AGENTS.md` invariant |
| `build` (optional) | `npm run build` | Node | `terminal-portfolio` | `npm ci` | none | command-level receipt only | n/a | `AGENTS.md` invariant |
| `integration` | `npx vitest run tests/integration --reporter=junit --outputFile=${run:evidence}/integration.xml` against a real `next start` server (component `web`, `${component:web.url}`) | Node | `terminal-portfolio` | `npm ci && npm run build` | `http`, component `web`, endpoint `/` | `junit-xml` as above | `npx vitest list tests/integration --json` | `GET /` 200, `<html lang class="dark">`, header command `whoami --verbose` |
| `e2e` | `npx playwright test --reporter=junit` (`PLAYWRIGHT_JUNIT_OUTPUT_NAME=${run:evidence}/e2e.xml`) | Node + Chromium | `terminal-portfolio` | `npm ci && npx playwright install --with-deps chromium` | `http`, component `web`, browser required, preview via `preview up` | `junit-xml`; identity = runner `playwright`, suite = spec file, class = describe, case = title (project name kept as a parameter) | `npx playwright test --list --reporter=json` | keyboard `/` opens the shell; `prefers-reduced-motion` renders static hero; viewport screenshots at 375/1024 uploaded with `evidence upload` |

Data isolation for every Option B check: `data.isolation: shared`, no services, preparation `none: true` (a static site has no data service). Nested Docker or cluster privilege is not assumed; the preview needs only a Node component.

## Complexity Tracking

None — no constitution violations.

## History

- Loop 1, attempt `ss_spec_005-agent-tab-new_1794462113809_0` (2026-11-12): artifacts authored; result `needs_human` on Q-001 (no answer recorded).
- Loop 1, attempt `ss_spec_005-agent-tab-new_1794848839188_0` (2026-11-16): request unchanged; Q-001 resolved to A with the after-approval gate as the decision point; R-003/R-004 added; Option B tasks removed from `task-plan.json` (sketch kept here); result `done`.
