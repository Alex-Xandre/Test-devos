# Implementation Plan: Agent test (no-op request)

**Branch**: `spec/005-agent-tab-new` | **Date**: 2026-11-12 | **Spec**: `requirements.md` (derived from the inline request)
**Input**: inline request "Nothing just for agent test" (sha256 `faecd60e…`), parameters `rigor: light`, `design: optional`
**Loop / attempt**: 1 / `ss_spec_005-agent-tab-new_1794462113809_0`

## Summary

The request asks for no change. The planning artifacts themselves are the deliverable of this "agent test" (R-002), the `terminal-portfolio` repository stays untouched (R-001), and the pipeline's outcome must be chosen by a person (R-003, Q-001) because the pinned downstream gates require `unit`, `lint`, `integration` and `e2e` evidence from a repository that contains only a design harness — no code, no `package.json`, no `devos.env.yaml` — and the repository cannot waive pipeline-required checks. **Result of this step: `needs_human`** with the exact decision in Q-001; recommended answer **A** (end the run with the plan as the test's output).

## Technical Context

**Language/Version**: none present. `AGENTS.md` prescribes Next.js (App Router) + Tailwind v4 + TypeScript for the future reference app.
**Primary Dependencies**: none installed (`git ls-files`: `AGENTS.md`, `CLAUDE-import.md`, `README.md`, `prompt`).
**Storage**: N/A.
**Testing**: none exists; no `devos.env.yaml` in `terminal-portfolio/`; `.hub/devos.env.yaml` absent (nothing composes a preview).
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
| D-2 | Declare `needs_human` rather than route to `implement`/`design`: the no-op cannot pass pipeline-required checks and the repository cannot declare them inapplicable. | `devos gates`; `static-gate.sh:184-196`; `research.md` §2 | R-003, Q-001 |
| D-3 | Design routing: **not required** (`designRequired: false`). The request has no UI behaviour; `AGENTS.md` already fixes every visual decision even for Option B. Recorded for the person's review. | `research.md` §4 | — |
| D-4 | Option B (minimal verifiable reference app) is sketched with concrete check contracts but gated on Q-001 and on identity inputs the request does not supply. | `AGENTS.md` generation recipe; `research.md` §3 | Q-001 |

No proposed ADRs: none of the above is an architectural decision of lasting significance to the repository.

## Project Structure

### Documentation (this feature)

```text
specs/spec/005-agent-tab-new/
├── plan.md              # this file
├── research.md          # unknowns and evidence
├── requirements.md      # R-001..R-003, AC-001..AC-003, Q-001
└── task-plan.json       # executable task plan (status: needs_input)
```

No `data-model.md`, `contracts/` or `quickstart.md`: the feature has no data, no interfaces and nothing to run. No `merge-order.json`: only the hub repository changes (planning documents); `terminal-portfolio` receives no branch.

### Source Code

Unchanged. Under Option B only, the layout would follow `AGENTS.md`/`README.md`: `src/app/globals.css`, `src/app/layout.tsx`, `src/lib/site.ts`, `src/components/{appbar,ticker,hero}.tsx`, `tests/unit/`, `tests/e2e/`, `devos.env.yaml`.

## Interfaces, state, errors, migration, deployment, rollback

Not applicable for the chosen result: no interface, state transition, migration, deployment or rollback exists. Rollback of this step is deleting `specs/spec/005-agent-tab-new/` in the hub.

## Design routing

`design: optional` → **implement is the correct declaration for routing purposes; this step returns `needs_human` instead** (D-2). Reason: no visual behaviour is requested and the harness pre-decides all visuals. The caller owns subsequent routing after Q-001 is answered.

## Acceptance-to-test matrix

| ID | Boundary | Setup | Observable assertion | Environment | Automated evidence | Owner |
|----|----------|-------|----------------------|-------------|--------------------|-------|
| AC-001 | CLI, target-free | checkout of both branches | `git -C terminal-portfolio diff --stat main...spec/005-agent-tab-new` prints nothing | any pod with the repository mounted | `V-001` in `task-plan.json` (command output captured as this step's evidence; a no-branch outcome for `terminal-portfolio` is the platform's own record) | plan (this step) |
| AC-002 | CLI, target-free | hub checkout | the four bound files exist; `task-plan.json` parses, `schemaVersion == 1`, `dependsOn` acyclic, every cited `AC-*`/`R-*` ID exists in `requirements.md` | any pod | `V-002` (python3 -I one-liner) | plan (this step) |
| AC-003 | human decision | the person reads Q-001 | a `factory_member` records A, B or C | devOS UI | none possible — subjective/explicitly a person's decision; this is the only `[human]` item | factory_member |

No unit, integration or E2E check applies to a no-op; no third-party stand-ins; no mocking.

## Planned check contracts and ownership

**Chosen result (Option A)** — no `devos.env.yaml` check is authored or published; nothing executes against `terminal-portfolio`. The two validations V-001/V-002 are plain commands run by this step (cwd `/workspace`, no runtime, no setup, no target, no secrets) and are recorded in `task-plan.json`. The pipeline-required checks remain **unavailable**, which is precisely the fact Q-001 asks the person to resolve; it is not reported as pass or as pre-existing debt.

**Only if Q-001 = B** (owner for all of these: the `implement` step; no separate test author is supplied, so implement writes the tests first and publishes the recipe with `recipe publish` before any check runs):

| Check | Runner / command | Runtime | cwd | Setup | Target | Report | Collection | Acceptance IDs (to be defined in the re-specified feature) |
|-------|------------------|---------|-----|-------|--------|--------|------------|-----|
| `unit` | `npx vitest run --reporter=junit --outputFile=${run:evidence}/junit.xml` | Node 20+ | `terminal-portfolio` | `npm ci` | none | `junit-xml`; identity = runner `vitest`, suite = file path, class = describe scope, case = test title; skip policy: `test.skip`/`todo` reported as skipped, never omitted | `npx vitest list --json` | pure helpers (`site.ts` constants, list-date `${year}-${month}` rule) |
| `lint` | `npx eslint . -f junit -o ${run:evidence}/eslint.xml` | Node | `terminal-portfolio` | `npm ci` | none | `junit-xml` (one case per file/rule) | n/a (static gate; no collection API — branch-addition attribution unknown without base/head manifests) | lint-clean |
| `typecheck` (optional) | `npx tsc --noEmit` | Node | `terminal-portfolio` | `npm ci` | none | command-level receipt only (tsc has no case report) | n/a | `AGENTS.md` invariant |
| `build` (optional) | `npm run build` | Node | `terminal-portfolio` | `npm ci` | none | command-level receipt only | n/a | `AGENTS.md` invariant |
| `integration` | `npx vitest run tests/integration --reporter=junit --outputFile=${run:evidence}/integration.xml` against a real `next start` server (component `web`, `${component:web.url}`) | Node | `terminal-portfolio` | `npm ci && npm run build` | `http`, component `web`, endpoints `/` | `junit-xml` as above | `npx vitest list tests/integration --json` | `GET /` 200, `<html lang class="dark">`, header command `whoami --verbose` |
| `e2e` | `npx playwright test --reporter=junit` (`PLAYWRIGHT_JUNIT_OUTPUT_NAME=${run:evidence}/e2e.xml`) | Node + Chromium | `terminal-portfolio` | `npm ci && npx playwright install --with-deps chromium` | `http`, component `web`, browser required, preview via `preview up` | `junit-xml`; identity = runner `playwright`, suite = spec file, class = describe, case = title (project name is a parameter, kept) | `npx playwright test --list --reporter=json` | keyboard `/` opens the shell; `prefers-reduced-motion` renders static hero; viewport screenshots at 375/1024 uploaded with `evidence upload` |

Data isolation for every Option B check: `data.isolation: shared`, no services, preparation `none: true` (a static site has no data service). No fresh-state criterion exists. Nested Docker or cluster privilege is not assumed; the preview needs only a Node component.

## Complexity Tracking

None — no constitution violations.

## History

- Loop 1, attempt `ss_spec_005-agent-tab-new_1794462113809_0` (2026-11-12): artifacts authored; result `needs_human` on Q-001.
