# Implementation Plan: 004-show-description — testimonials page

**Branch**: `spec/004-show-description` | **Repository**: `terminal-portfolio` | **Base**: `main`
**Requirements**: `requirements.md` | **Research**: `research.md` | **Tasks**: `task-plan.json`
**Status**: ready. Design route: **implement** (see Design routing).

## Summary

Run the harness (`AGENTS.md`) to produce a minimal Next.js App Router + Tailwind v4 scaffold, then add a `/testimonials` page framed as `cat testimonials/*.md`. Static data, no services. Checks are declared in `terminal-portfolio/devos.env.yaml` and published before first run.

## Governing rules

- Harness rules 1–10 (`AGENTS.md:19-49`), consistency invariants (`AGENTS.md:304-314`).
- Constitution: absent at `.hub/.specify/memory/constitution.md` → recorded **N/A**. No ADRs exist; none proposed (no significant architectural choice beyond following the harness).

## Technical context

- TypeScript, Next.js 15 App Router, Tailwind v4, IBM Plex Mono/Sans via `next/font`, `motion` for `Container` fade-up (`AGENTS.md:170-174`).
- Tests: Vitest (+ RTL, jsdom), Playwright, ESLint (`eslint-config-next`, `eslint-formatter-junit`).
- Preview: one component `web`, `npm run build && npm run start -- -p 3000`, health `GET /`. No support services.

## File layout (terminal-portfolio)

```
package.json  next.config.ts  tsconfig.json  eslint.config.mjs  postcss.config.mjs
vitest.config.ts  playwright.config.ts  devos.env.yaml
src/lib/site.ts                                  SHELL, SITE_URL, EMAIL, socials
src/app/globals.css                              tokens + scanlines/cursor/reduced-motion
src/app/layout.tsx                               fonts, dark, themeColor, Appbar, scroll region
src/app/page.tsx                                 minimal home: header + cd /testimonials →
src/app/not-found.tsx                            404 pattern (client)
src/app/(features)/testimonials/page.tsx         route
src/app/(features)/testimonials/testimonials-data.ts
src/components/container.tsx  appbar.tsx  command-header.tsx  testimonial-row.tsx
tests/unit/*.test.tsx  tests/unit/harness-rules.test.ts
tests/integration/*.spec.ts  tests/e2e/*.spec.ts
```

## Interfaces

- `Testimonial = { slug: string; name: string; role: string; company?: string; quote: string; year?: number; link?: string }`; `TESTIMONIALS: Testimonial[]`.
- `CommandHeader({ command, subtitle })` → the exact markup at `AGENTS.md:179-184`, reading `SHELL` from `site.ts`.
- `TestimonialRow({ t })` → `<li class="border-b border-dashed border-border py-4">` with mono header line `{slug}.md · {name}, {role}[ @ {company}][ · {year}]` (separators only when the part exists) and `<p class="font-sans text-sm text-text-primary">` quote; optional `<a>` `./open --link` ghost style, `target=_blank rel=noreferrer`.
- `TestimonialsPage()` server component: `CommandHeader` + `<ul>` of rows, or `<p class="text-text-secondary">cat: testimonials/*.md: No such file or directory</p>` when empty.
- `SIDEBAR_MENU` in `appbar.tsx`: `[{ href: "/", label: "~" }, { href: "/testimonials", label: "testimonials" }]`; `aria-current="page"` on the active link via `usePathname`.

## State, errors, compatibility

Read-only rendering; no state transitions. Empty data → shell-style empty line (REQ-003). Missing optional fields → omitted (AC-003.2). No migration; rollback = revert branch. Deployment target is any Node/Vercel host; nothing environment-specific.

## Dependency order and ownership

Single repository, implementation owner authors tests first and publishes recipes (no separate test author supplied). Order: scaffold → publish recipes → red unit/integration tests → implement → e2e + evidence. See `task-plan.json`. No `merge-order.json` (one repo).

## Acceptance-to-test matrix

| AC | Boundary | Setup | Observable assertion | Environment |
|---|---|---|---|---|
| AC-001.1 | Static | scaffold | `tsc --noEmit` exit 0; `next build` exit 0 | `typecheck`, `build` checks, cwd `terminal-portfolio` |
| AC-001.2 | Integration | preview `web` | `GET /` 200, body contains `testuser@sh:~` and `cd /testimonials →`; `GET /unknown` 404 body contains `No such file or directory` and `process exited 127` | Playwright request, `target: http` |
| AC-001.3 | Integration | preview | `<html lang="en" class="dark">`; `<meta name="theme-color" content="#0d0b07">` | Playwright request |
| AC-002.1 | Unit | `TESTIMONIALS` | unique non-empty slugs; non-empty name/quote | Vitest |
| AC-002.2 | Static | types | `tsc` accepts entries without company/year/link | typecheck |
| AC-003.1 | Unit | render page with 3 fixtures | 3 `li`; each contains name + quote; quote has `font-sans` | Vitest + RTL |
| AC-003.1 | Integration | preview, real data | `GET /testimonials` 200; every `TESTIMONIALS[i].name` and quote present in HTML | Playwright request |
| AC-003.2 | Unit | fixture w/o company and year | header text has no ` @ ` and no trailing `·` | Vitest |
| AC-003.3 | Unit | `[]` | `cat: testimonials/*.md: No such file or directory`; 0 `li` | Vitest |
| AC-003.4 | E2E | browser, preview | from `/`, click nav `testimonials` → URL `/testimonials`, header text `$ cat testimonials/*.md`, nav link `aria-current="page"` | Playwright chromium |
| AC-004.1 | Unit | scan `src/**/*.{ts,tsx,css}` | no `/#[0-9a-f]{3,8}/` outside `globals.css` tokens; no `neutral-`; `rounded-` only as `rounded-full` on dot classes | Vitest |
| AC-004.2 | E2E | browser | `.scanlines[aria-hidden=true]`; Tab to nav link → `getComputedStyle(outlineColor)` equals resolved `--accent` | Playwright chromium |
| AC-004.3 | E2E | browser, `reducedMotion: 'reduce'` | content identical; `Container` has no running animation (`getAnimations().length === 0`) | Playwright chromium |
| AC-003.1 visual | E2E | 375×812 and 1280×800 | screenshots `specs/spec/004-show-description/evidence/testimonials-{mobile,desktop}.png` via `evidence upload` | Playwright chromium |
| AC-005.1 | Gate | recipes published | `devos gates` lists checks as available | pod |

All criteria have automated proof; no `[human]` tasks.

## Planned check contracts (devos.env.yaml, owner: implementation, publish via `recipe publish` before first run)

| check | command | cwd | target | report | ACs |
|---|---|---|---|---|---|
| unit | `npx vitest run --reporter=junit --outputFile=reports/unit.xml` | terminal-portfolio | none | junit-xml | AC-002.1, 003.1-3, 004.1 |
| lint | `npx eslint . -f junit -o reports/lint.xml` | terminal-portfolio | none | junit-xml | gate |
| typecheck | `npx tsc --noEmit` | terminal-portfolio | none | exit code (gate) | AC-001.1, 002.2 |
| build | `npm run build` | terminal-portfolio | none | exit code (gate) | AC-001.1 |
| integration | `npx playwright test tests/integration --reporter=junit` → `reports/integration.xml` | terminal-portfolio | http, component `web` | junit-xml | AC-001.2-3, 003.1 |
| e2e | `npx playwright test tests/e2e --reporter=junit` → `reports/e2e.xml`, browser chromium | terminal-portfolio | http, component `web` | junit-xml | AC-003.4, 004.2-3 |

- Env for http checks: `BASE_URL` from `preview url`. Secrets: none. Browser: chromium via `npx playwright install chromium` in setup (no Docker/cluster privilege needed).
- Skip policy: skipped cases reported as junit `<skipped>` with a reason; none planned.
- Identities: runner (`vitest`/`playwright`/`eslint`), suite = file path, case = full title; retries are metadata. Reports are separate files, never overwritten across suites.
- Collect: `vitest list --reporter=json`, `playwright test --list --reporter=json` (see research).
- Data isolation: not applicable — no services, static data. Preparation: `none: true`.

## Design routing

`design: optional` → **implement**. Reason: the harness specifies tokens, command headers, list rows, typography, buttons, nav and 404 exactly; the testimonials page composes those patterns without new visual elements. Recorded for the person's review.

## Risks

- R1: Next/Tailwind v4 version drift at scaffold time → pin versions in `package.json`.
- R2: Placeholder identity/testimonial content (A1) must be replaced by the person before publishing the site; the data file carries a comment saying so.
