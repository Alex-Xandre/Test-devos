# Research: Agent test (no-op request)

**Branch**: `spec/005-agent-tab-new`
**Date**: 2026-11-12
**Rigor**: light — only decisions that affect this change are recorded.

## Unknowns Resolution

### 1. What does the request actually require?

- **Decision**: Nothing is to be built. The bound request is the literal text "Nothing just for agent test"; no other input (requirements, plan item, design brief) is bound. Derived requirements are R-001..R-003 in `requirements.md`.
- **Rationale**: The person is exercising the pipeline. Inventing a feature (for example, running the `AGENTS.md` generation recipe) would substitute the agent's guess for the person's request and would touch a repository the request says to leave alone.
- **Alternatives considered**: Treat the repository's `prompt` file as the request (rejected — it is a sample prompt for a hypothetical "Test User", not a bound input; the platform binds only the inline text). Generate a tiny "hello" change to have something to test (rejected — any change to `terminal-portfolio` contradicts "Nothing").

### 2. Can the downstream gates pass on this repository as it stands?

- **Decision**: No. `devos gates` (pinned graph) lists for `implement`: `ready_requires integration, e2e`; for `validate`: `unit`, `lint`, `integration`, `e2e` required, `typecheck`, `build` optional. Every check reports `terminal-portfolio@unknown: unavailable` because the repository has no `devos.env.yaml` (confirmed by `recipe publish`: "devos.env.yaml is missing") and no code, `package.json` or test runner at all (`git ls-files`: `AGENTS.md`, `CLAUDE-import.md`, `README.md`, `prompt`).
- **Evidence**: `devos gates` output; `/usr/local/bin/static-gate.sh` lines 150–210: a committed `checks.<id>.applicability: {required: false, reason}` is accepted **only** when the pinned pipeline's applicability for that check is `required: false` ("committed inapplicability is not permitted by this pinned pipeline" otherwise). The pipeline pins `unit`, `lint`, `integration`, `e2e` as required, so the repository cannot waive them.
- **Alternatives considered**: Author a `devos.env.yaml` declaring the four checks inapplicable (rejected — refused by the static gate for required checks). Author placeholder checks that exit 0 (rejected — "console text or exit zero alone is not supported acceptance evidence"; also a change to the repository). Hence Q-001 is a person's decision, not the agent's.

### 3. What would the smallest honest "Option B" scaffold need? (recorded so the person can judge its size)

- **Decision**: If the person chooses Option B, the minimal verifiable scaffold is generation-recipe steps 1–5 of `AGENTS.md` (tokens + `globals.css`, `layout.tsx`, `src/lib/site.ts`, Appbar + Ticker, Hero) plus a test toolchain: Vitest (unit, `junit` reporter, `vitest list --json` for collection), ESLint (`-f junit`), `tsc --noEmit` and `next build` (static gate, command-level receipts only), Playwright (e2e over `next start`, `target: http`, browser capability, `junit` reporter, `--list --reporter=json` for collection), and a published `terminal-portfolio/devos.env.yaml` with a `web` component. Identity data (name, handle, role, email, socials, palette) is **required input** and is absent from this request.
- **Rationale**: This is a real feature with product decisions (identity, palette, copy) that `AGENTS.md` says must come from the person. It is sketched in `task-plan.json` (tasks `T-B01`…`T-B05`) but gated on Q-001.
- **Alternatives considered**: A non-Next.js stub app just to make gates green (rejected — it would be throwaway code in a repository whose harness mandates Next.js App Router + Tailwind v4, and would mislead later features).

### 4. Is visual design required?

- **Decision**: No (`design: optional` → `implement` route is the correct declaration if a route is ever taken; here the result is `needs_human`). The request carries no UI behaviour; even Option B is fully specified visually by `AGENTS.md` (tokens, pattern language, accessibility floor).
- **Rationale**: A design step would have nothing to decide.
- **Alternatives considered**: `design` route (rejected — no unresolved visual choice exists).

## Codebase evidence consulted

| Path | Why |
|------|-----|
| `terminal-portfolio/AGENTS.md` | The only "code" in the repository: design harness, rules, generation recipe, consistency invariants (`npx tsc --noEmit`, `npm run build`). |
| `terminal-portfolio/README.md` | States "Status: harness-first … Reference implementation … coming" — confirms there is no app to test. |
| `terminal-portfolio/prompt` | Sample generation prompt; not a bound input (assumption A-2). |
| `.hub/.specify/templates/plan-template.md`, `research-template.md` | Output structure. |
| `/usr/local/bin/static-gate.sh:150-210` | Applicability rule for declaring a check not required. |
| `/usr/local/bin/recipe-services.cjs:105-200` | `devos.env.yaml` schema shape used by the Option B check contracts (`checks.<id>.{command,cwd,component,target,prepare,env,data,report}`, `components`, `services`, `prepare` DAG). |
