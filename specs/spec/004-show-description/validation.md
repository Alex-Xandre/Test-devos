# Validation — spec/004-show-description

| Field | Value |
|---|---|
| Stage | validate (uptic/validate@4) |
| Pipeline run | 61e0d699-9923-4c43-98a5-9071e14aefc5 |
| Attempt | ss_spec_004-show-description_1795497676637_0 (loop 1) |
| Bound scope | specs/spec/004-show-description/task-plan.json @ c10f6b3 — sha256 b2674ad7f74ad72a41a96e10a0189edb3fc73b43b2e2ea010afa629623eafabb (verified, matches) |
| Candidate | **(none)** — `devos step status`: "no repository of this feature has code changes, so there is nothing to judge" |
| Verdict | **needs_human** — nothing is proven; no obligation can be judged on this candidate |

## 1. What was found

There is no implementation to validate.

| Fact | Evidence |
|---|---|
| terminal-portfolio feature branch `spec/004-show-description` is at `32190a991ff3d064d493f28a43e6451cf062578a`, identical to `main`. Zero commits, zero diff. | `git -C terminal-portfolio log`, `git diff --stat main...HEAD` (empty) |
| terminal-portfolio contains only `AGENTS.md`, `CLAUDE-import.md`, `README.md`, `prompt`, `.git`. No `package.json`, no `src/`, no `tests/`, no `devos.env.yaml`. | `ls -A terminal-portfolio/` |
| The GitHub remote has no `spec/004-show-description` branch for terminal-portfolio (heads: `main`, `spec/002-rocket-101`, `spec/003-test`). | `git ls-remote --heads origin` |
| `devos gates`: every check (unit, lint, typecheck, build, integration, e2e) is `not_declared` for terminal-portfolio@32190a9. | `devos gates` |
| The platform's recorded step head for terminal-portfolio is `00ac38a7fe5d8c90d03d946b82d5535962f8c388`. This object exists in neither this pod's terminal-portfolio clone nor the hub clone, nor on the GitHub remote. | `git cat-file -t 00ac38a7fe5d…` → "could not get object info" (both repos); implement blocker record in `implementation-plan.json` |
| The implement step (attempt ss_spec_004-show-description_1795154767955_0) never produced code. Its only child, worker `2f8cae8d`, ended `start_failed → needs_human` on the same unreachable commit. Its plan records a `blocker` naming this as requiring "a platform/person repair of the recorded terminal-portfolio head". | `implementation-plan.json` lines 134–147; hub commit c10f6b3 |
| `pipeline upstream` nevertheless reports the implement receipt as "done at 2026-11-24 05:21, approved". No `implementation.md` exists in the spec folder. | `pipeline upstream`; `ls specs/spec/004-show-description/` |

## 2. Child attempts on this validate step (all on the recorded head `00ac38a7fe5d`)

Required by the pipeline: `["preview","unit","static","integration","e2e","diff","redteam"]`. Each was started or attempted once; none produced a usable verdict.

| Child key | Run / attempt | Outcome | Classified cause | Evidence |
|---|---|---|---|---|
| preview | `c7662cc5-00dc-497a-8200-eb8ae96caad9` | **fail** (verdict fail, exit 1) | `phase=config reason=configuration_error retryable=false`: "this branch has no preview recipe — add a devos.env.yaml with a components list…" | `devos runs result preview`; `preview why --json` at 2026-11-24T05:23:41Z; events #749, #750 |
| unit | refused at start (event 743) | **unavailable** | `check_undeclared: no repository declares 'unit'` | `devos runs start unit --repo terminal-portfolio` |
| static | refused at start | **unavailable** | `check_undeclared: no repository declares 'lint'` | `devos runs start static --repo terminal-portfolio` |
| integration | refused at start | **unavailable** | `check_undeclared: no repository declares 'integration'` | `devos runs start integration --repo terminal-portfolio` |
| e2e | refused at start | **unavailable** | `check_undeclared: no repository declares 'e2e'` | `devos runs start e2e --repo terminal-portfolio` |
| diff | `79897e45-a298-4b41-9c42-32ae3f6799b1` | **needs_human** (hold `start_failed`, owner: person) | Pod entrypoint: "FATAL: pinned commit 00ac38a7fe5d8c90d03d946b82d5535962f8c388 is not available from https://github.com/Alex-Xandre/terminal-portfolio — refusing to run on a different commit". Container exited 1 before the gate ran. | `devos describe run 79897e45…`; events 755–757 |
| redteam | refused at start (event 747) | **unavailable** | `waiting_for_results: redteam reads preview, which have not finished` — the preview it depends on failed in config phase | `devos runs start redteam` |

No child reached the stage of running a check, so there is no `<check>.log`, junit report or screenshot to read. No judge's report was altered. No product code or tests were changed by this step.

## 3. Attribution

This is **not** a defect in the feature branch — there is no feature branch content to be defective.

Two causes, both outside this step's authority to repair:

1. **Platform record** — the step head pinned for mount `terminal-portfolio` (`00ac38a7fe5d`) does not exist in any reachable repository. Every pod-based child (diff gate now; implement's worker and three earlier auto-previews before) dies in the entrypoint. `devos runs start --input <sha>` only accepts head/results/joins, so no agent can re-point it. This is an operator-only hold (`hold: start_failed (owner person)`), the same one the implement step recorded. It was not repaired between implement and validate.
2. **Pipeline state** — the implement step receipt was marked done/approved while implement's own record says it was blocked and produced nothing. Validate therefore received an empty candidate with no recipe (`devos.env.yaml` absent), which is exactly what T001/T002 of the bound task-plan were supposed to create.

A return to implement alone would reproduce the identical `start_failed` on `00ac38a7fe5d` — implement cannot start a worker until cause 1 is fixed. Declaring `fail` would misattribute an infrastructure fault to the branch. Declaring `pass` is impossible: no required obligation is proven and the platform would reject it.

## 4. What a person must decide / repair

1. Repair the recorded terminal-portfolio head for `spec/004-show-description` so pods can check it out — either re-point it to the reachable base `32190a991ff3d064d493f28a43e6451cf062578a` (= GitHub `main` = `refs/devos/mount-base`) or publish a branch containing `00ac38a7fe5d`.
2. Re-run **implement** (its receipt approval should not stand: there is no implementation). The partition plan (`implementation-plan.json`: packages scaffold → testimonials → e2e) is ready to start unchanged once pods can boot.
3. Only then re-run validate. The implement step's T002 must `recipe publish` a `devos.env.yaml` so the preview and the unit/lint/typecheck/build/integration/e2e checks stop being `check_undeclared`.

## 5. Verification expected after repair

On a candidate that actually contains the scaffold and testimonials page:

- `devos gates` lists unit, lint, typecheck, build, integration, e2e as declared for terminal-portfolio (AC-005.1).
- preview child reaches `ready` with `preview.url` (component `web`, health GET /).
- unit: vitest junit `reports/unit.xml` green — harness-rules scan, layout, testimonials-data, testimonials-page (AC-001.1, AC-002.1, AC-003.1–3, AC-004.1).
- static: eslint junit green; `npx tsc --noEmit` exit 0; `npm run build` exit 0 (AC-001.1, AC-002.2).
- integration: Playwright request-API `reports/integration.xml` green against preview URL — `/`, `/unknown` 404, `/testimonials` 200 with all names and quotes (AC-001.2, AC-001.3, AC-003.1).
- e2e: chromium `reports/e2e.xml` green — nav to /testimonials, aria-current, focus outline = `--accent`, scanlines aria-hidden, reduced-motion; screenshots 375×812 and 1280×800 uploaded via `evidence upload` (AC-003.4, AC-004.2, AC-004.3).
- diff gate and redteam complete with recorded results.

## 6. Unproven

Every acceptance criterion in the bound task-plan (AC-001.1 … AC-005.1) remains unproven. Nothing in this report asserts that any part of the feature works.
