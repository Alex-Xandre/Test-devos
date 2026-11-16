# Research: Agent test (no-op request)

**Branch**: `spec/005-agent-tab-new`
**Date**: 2026-11-16 (loop 1, attempt `ss_spec_005-agent-tab-new_1794848839188_0`)
**Rigor**: light — only decisions that affect this change are recorded.

## Unknowns Resolution

### 1. What does the request actually require?

- **Decision**: Nothing is to be built. The bound request is the literal text "Nothing just for agent test" (sha256 verified); no other input is bound. Derived requirements are R-001..R-004 in `requirements.md`.
- **Rationale**: The person is exercising the pipeline. Inventing a feature (for example, running the `AGENTS.md` generation recipe) would substitute the agent's guess for the person's request and would touch a repository the request says to leave alone.
- **Alternatives considered**: Treat the repository's `prompt` file as the request (rejected — a sample prompt for a hypothetical "Test User", not a bound input). Generate a tiny "hello" change to have something to test (rejected — any change to `terminal-portfolio` contradicts "Nothing").

### 2. Can the downstream gates pass on this repository as it stands?

- **Decision**: No, and the plan must not try to make them pass. `devos gates` (pinned graph) lists for `implement`: `ready_requires integration, e2e`; for `validate`: `unit`, `lint`, `integration`, `e2e` required, `typecheck`, `build` optional. Every check reports `terminal-portfolio@unknown: unavailable`: the repository has no `devos.env.yaml` (`recipe publish` → "devos.env.yaml is missing; author the recipe before publishing or declaring check data", exit 1) and no code or test runner at all (`git ls-files`: `AGENTS.md`, `CLAUDE-import.md`, `README.md`, `prompt`).
- **Evidence**: `/usr/local/bin/static-gate.sh:192-193` — a committed `checks.<id>.applicability: {required: false, reason}` is accepted **only** when the pinned pipeline's applicability for that check is `required: false`; otherwise "committed inapplicability is not permitted by this pinned pipeline". The pipeline pins `unit`, `lint`, `integration`, `e2e` as required.
- **Alternatives considered**: Author a `devos.env.yaml` declaring the four checks inapplicable (rejected — refused by the static gate). Author placeholder checks that exit 0 (rejected — "console text or exit zero alone is not supported acceptance evidence"; also a change to the repository). Hence R-003: downstream steps report these checks as unavailable/unknown.

### 3. Should this step block again on a person's decision?

- **Decision**: No. The previous attempt (`ss_spec_005-agent-tab-new_1794462113809_0`, hub commit `b6bb3a5`) returned `needs_human` on Q-001; no answer was recorded and the step was re-run with the identical request. The request text already answers the question ("Nothing"), and the pipeline supplies a human approval contract on this very step (`plan.approval: {when: after, approvers: [factory_member]}`), so the person decides with the complete plan in hand. Q-001 is therefore recorded as resolved to A with B/C left as the approver's alternatives (R-004), and the step completes with `done`.
- **Rationale**: Re-asking an unanswered question through a second channel adds a round-trip and no information. The approval gate is the supplied contract for exactly this decision.
- **Alternatives considered**: `needs_human` again (rejected — see above). Silently routing to `design` (rejected — nothing to design, §4).

### 4. Is visual design required?

- **Decision**: No. `design: optional` → declare **implement**. The request carries no UI behaviour; even the Option B alternative is fully specified visually by `AGENTS.md` (tokens, pattern language, accessibility floor).
- **Rationale**: A design step would have nothing to decide.
- **Alternatives considered**: `design` route (rejected — no unresolved visual choice exists).

### 5. What would the smallest honest "Option B" scaffold need? (recorded so the approver can judge its size)

- **Decision**: If the approver rejects the no-op and re-requests a real feature, the minimal verifiable scaffold is generation-recipe steps 1–5 of `AGENTS.md` (tokens + `globals.css`, `layout.tsx`, `src/lib/site.ts`, Appbar + Ticker, Hero) plus a test toolchain: Vitest (unit, `junit` reporter, `vitest list --json` for collection), ESLint (`-f junit`), `tsc --noEmit` and `next build` (static gate, command-level receipts only), Playwright (e2e over `next start`, `target: http`, browser capability, `junit` reporter, `--list --reporter=json` for collection), and a published `terminal-portfolio/devos.env.yaml` with a `web` component. Identity data (name, handle, role, email, socials, palette) is **required input** and is absent from this request. The concrete check contracts are tabled in `plan.md` but no task in `task-plan.json` executes them.
- **Rationale**: This is a real feature with product decisions that `AGENTS.md` says must come from the person.
- **Alternatives considered**: A non-Next.js stub app just to make gates green (rejected — throwaway code in a repository whose harness mandates Next.js App Router + Tailwind v4).

## Codebase evidence consulted

| Path | Why |
|------|-----|
| `terminal-portfolio/AGENTS.md` | The only "code" in the repository: design harness, rules, generation recipe, consistency invariants (`npx tsc --noEmit`, `npm run build`). |
| `terminal-portfolio/README.md:21-24` | "Status: harness-first … Reference implementation … coming" — confirms there is no app to test. |
| `terminal-portfolio/prompt` | Sample generation prompt; not a bound input (assumption A-2). |
| `terminal-portfolio/CLAUDE-import.md` | Only imports `AGENTS.md`; no other instruction source. |
| `.hub/.specify/templates/plan-template.md`, `research-template.md` | Output structure. |
| `/usr/local/bin/static-gate.sh:181-200` | Applicability rule for declaring a check not required. |
