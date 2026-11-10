# Research: 004-show-description — testimonials page

**Rigor**: light. Only decisions that affect this change.

## Codebase state

- `terminal-portfolio`: only `AGENTS.md`, `CLAUDE-import.md`, `README.md`, `prompt`. No app code, no `devos.env.yaml`, no checks. `devos gates`: unit, lint, integration, e2e required and unavailable; typecheck, build optional.
- `.hub`: specs only; no constitution, no ADRs.

## Harness findings used

| Topic | Location | Use |
|---|---|---|
| Generation recipe steps 2–4 | `AGENTS.md:318-328` | Minimal scaffold order: tokens → layout → Appbar |
| Tokens | `AGENTS.md:51-81` | `globals.css` block, `@theme inline` names |
| Layout skeleton, Container | `AGENTS.md:158-174` | `layout.tsx`, `Container` class strings |
| Command header | `AGENTS.md:178-190` | `cat testimonials/*.md` header |
| Nav links, filter/empty-state idiom | `AGENTS.md:192-200` | `cd /testimonials →`; empty state speaks shell |
| List rows, dashed vs solid | `AGENTS.md:202-211` | Testimonials are a text list → dashed borders |
| Buttons | `AGENTS.md:248-252` | `./open --link` label for optional link |
| 404 | `AGENTS.md:298-302` | Required by scaffold step |
| Accessibility floor | `AGENTS.md:44-47` | aria-hidden scanlines, aria-current, accent focus ring, reduced motion |
| Consistency invariants | `AGENTS.md:304-314` | tsc + build; no `neutral-` |
| Omissions | `AGENTS.md:343-348` | `/recommendations` is listed as un-themed legacy; testimonials replaces that idea, no second page |

## Decisions

1. **Shell idiom for testimonials: `cat testimonials/*.md`.** Alternatives: `git log --reviews` (conflicts with experience = git log, `AGENTS.md:220`), `ls testimonials/` (hides quote bodies). `cat` fits reading multiple text files, so quotes render as sans paragraphs under a mono `{slug}.md` header.
2. **Dashed borders.** Harness: solid = projects, dashed = text lists (`AGENTS.md:211`).
3. **Minimal scaffold, not the full site.** The person asked for one page. Home is a command header + `cd /testimonials →` so the page is reachable and the 404 tree is real. Full hero/projects/blog/stacks/shell/ticker/cat are later features.
4. **Test tooling**: Vitest + `@testing-library/react` + jsdom for unit (junit reporter built in); Playwright for integration (request API, no browser) and e2e (chromium) with `--reporter=junit`. ESLint via `eslint-config-next` with `eslint-formatter-junit`. Alternative Jest rejected: more config for Next App Router + ESM.
5. **Harness static rules as a unit test** (`harness-rules.test.ts` scanning `src/`) instead of custom ESLint rules: cheaper, reported through the same junit channel.
6. **Design route: implement.** Every visual element has a harness pattern; nothing new to design.

## Collection

- Vitest: `vitest list --reporter=json` yields the case manifest; Playwright: `playwright test --list --reporter=json`. Identities: runner + file path (suite) + full title (case). Base manifests do not exist on `main` (no code), so branch-addition attribution is "all new" for this feature.
