# Requirements: Agent test (no-op request)

**Branch**: `spec/005-agent-tab-new` | **Date**: 2026-11-16 | **Loop**: 1 | **Attempt**: `ss_spec_005-agent-tab-new_1794848839188_0`
**Source**: inline request bound by the pipeline (`request`, kind `text`, sha256 `faecd60eb42aaf29c08aed4eee076169f966834368cbba999bb2eb9fc71fb476`, verified against the bound value):

> "Nothing just for agent test"

No requirements document, planning item or design brief was bound (all `null`). The request text is the sole requirement source and is treated as complete.

## Derived requirements

| ID | Requirement | Source | Acceptance |
|----|-------------|--------|------------|
| **R-001** | The feature makes **no change** to the `terminal-portfolio` repository: no application code, no harness edits (`AGENTS.md`, `README.md`, `prompt`, `CLAUDE-import.md`), no `devos.env.yaml`. | Request: "Nothing" | **AC-001** `git -C terminal-portfolio diff --stat main...HEAD` prints nothing and exits 0; the platform publishes no branch for that repository. |
| **R-002** | The planning step produces the four bound artifacts (`plan.md`, `research.md`, `requirements.md`, `task-plan.json`) under `specs/spec/005-agent-tab-new/`, mutually consistent: `task-plan.json` is valid `schemaVersion: 1` JSON with an acyclic `dependsOn` graph, and every `AC-*`/`R-*` ID a task cites is defined here. | Request: "just for agent test" — the test exercises the pipeline, so the artifacts *are* the deliverable | **AC-002** All four files exist; the `V-002` command in `task-plan.json` exits 0 and prints `ok [...]`. |
| **R-003** | Downstream steps report the pipeline-required checks (`unit`, `lint`, `integration`, `e2e`) for `terminal-portfolio` as **unavailable/unknown** — never as pass, and never as pre-existing debt — because the repository has no code and no check recipe, and a committed `applicability: {required: false}` is refused by the static gate for checks the pipeline pins as required. No placeholder check, stub recipe or exit-zero command may be authored to turn them green. | `devos gates`; `recipe publish` → "devos.env.yaml is missing"; `/usr/local/bin/static-gate.sh:192-193` | **AC-003** No `terminal-portfolio/devos.env.yaml` exists on the branch (covered by AC-001), and the implement step's declared check evidence for the four checks is `unavailable` with the recipe-missing reason retained verbatim (checked by `V-003`). |
| **R-004** | The person confirms the no-op outcome through the plan's after-approval gate (`approvers: factory_member`), which is the supplied human approval contract. Rejecting there is the way to turn the test into a real feature (see Q-001 options B/C). | Pipeline gate `plan.approval {when: after}` | **AC-004** A `factory_member` approval or rejection is recorded on this step by the platform. Subjective — the only `[human]` item. |

## Assumptions

- **A-1** "Nothing" is literal: the person wants to see the agent pipeline run, not a product change. The harness documents in `terminal-portfolio` are not to be touched.
- **A-2** The `prompt` file in the repository (a sample "Test User / green phosphor" generation prompt) is sample content for human use, **not** a bound input to this feature; it does not imply a request to generate the portfolio.
- **A-3** No factory or repository constitution exists (`.hub/.specify/memory/` and `terminal-portfolio/.specify/` are absent), so there are no governing principles or accepted ADRs to check beyond the pipeline's own gates.
- **A-4** No data services, migrations or fresh-state criteria are involved; nothing needs `data.isolation: fresh` or preparation tasks (`none: true`).
- **A-5** The previous attempt of this step (`ss_spec_005-agent-tab-new_1794462113809_0`) returned `needs_human` on the same question with no answer recorded; the step was re-run with an unchanged request. Re-asking the identical question would add nothing, and the after-approval gate already gives the person the same decision with the full plan in front of them.

## Resolved / unresolved questions

| ID | Question | Blocking | Resolution |
|----|----------|----------|------------|
| **Q-001** | What should this agent test conclude with, given the request asks for nothing and the pinned gates require unit/lint/integration/e2e evidence from a repository with no code? | **No** (deferred to the after-approval gate, R-004) | **A (planned)** — the request text itself is the decision: build nothing, the plan artifacts are the test's deliverable, downstream steps report required checks as unavailable (R-003). The approver may instead choose **B** — reject and re-request a real feature "minimal verifiable reference app" with identity data (name, handle, role, email, socials, palette) so the Option B sketch in `plan.md` can be implemented test-first; or **C** — have a platform owner re-pin the pipeline so the four checks are not required for this test (the repository cannot do this from `devos.env.yaml`). |

## Out of scope

- Generating the portfolio application, choosing a palette, editing the harness, or adding dependencies — none of these are requested.
- Any visual design work: the harness already fixes the entire visual system; the request carries no UI behaviour.
- Authoring any check recipe or placeholder test for `terminal-portfolio` (forbidden by R-003).
