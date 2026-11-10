# Requirements: 004-show-description — testimonials page

**Branch**: `spec/004-show-description` | **Repository**: `terminal-portfolio` | **Rigor**: light | **Design**: optional → implement
**Status**: ready (supersedes the earlier "show description" draft; Q1/Q2 answered by the person, Q4 recorded as absent)

## Sources

- **S1 — Bound request** (inline prompt, sha256 `d6d7305e…`): "Read harness".
- **S2 — Person's stage message**: "just try to run harness and create new page which is testimonials". This resolves the feature: a `/testimonials` page built by following the harness.
- **S3 — Harness**: `terminal-portfolio/AGENTS.md` (commit `32190a9`). Cited as `AGENTS.md:<lines>`.
- **S4 — Repository state**: no application code exists (`package.json`, `src/`, `devos.env.yaml` absent). README says the reference implementation is "coming" (`README.md:21-24`).

## Derived requirements

### REQ-001 — Run the harness: minimal app scaffold
A Next.js App Router + Tailwind v4 app exists in `terminal-portfolio`, built per the harness generation recipe steps 2–4 (`AGENTS.md:318-328`): tokens + utilities, layout (fonts, forced dark, scanlines behind, fixed Appbar + scroll region), `src/lib/site.ts` with `SHELL`, Appbar with `SIDEBAR_MENU`, `Container`, and the 404 page (`AGENTS.md:298-302`). The home page is a minimal command header plus `cd /testimonials →`; full hero/projects/blog/stacks are out of scope.
- **AC-001.1**: `npx tsc --noEmit` and `npm run build` pass (`AGENTS.md:313`).
- **AC-001.2**: `GET /` returns 200 and contains the shell handle and a `cd /testimonials →` link; `GET /unknown` renders the 404 pattern (`bash: cd: /unknown: No such file or directory`, `process exited 127`).
- **AC-001.3**: `<html lang="en" class="dark">`; viewport `themeColor` is `#0d0b07` (`AGENTS.md:34-35`, `91-92`).

### REQ-002 — Testimonials data
Testimonials live in `src/app/(features)/testimonials/testimonials-data.ts` as `{ slug, name, role, company?, quote, year?, link? }[]`; components never hardcode identity (`AGENTS.md:132-136`).
- **AC-002.1**: Slugs are unique and non-empty; every `quote` and `name` is non-empty (unit).
- **AC-002.2**: Exported type `Testimonial`; `company`, `year`, `link` optional.

### REQ-003 — Testimonials page
Route `/testimonials` renders as shell output: command header `{SHELL} $ cat testimonials/*.md` with a one-line subtitle (`AGENTS.md:178-190`); one row per testimonial, dashed-border list (`AGENTS.md:211`); row header in mono: `{slug}.md  ·  {name}, {role}[ @ {company}][  ·  {year}]`; quote body in `font-sans` (`AGENTS.md:27-30`); optional `link` rendered as `./open --link` ghost button text (`AGENTS.md:248-252`). Empty data renders `cat: testimonials/*.md: No such file or directory` (`AGENTS.md:199-200`).
- **AC-003.1**: With N testimonials, the page renders N rows, each containing the name and the full quote; the quote element carries `font-sans` (unit + integration).
- **AC-003.2**: Missing `company`/`year` produce no dangling `@` or `·` separators (unit; mirrors `AGENTS.md:205-206`).
- **AC-003.3**: Empty array renders the `cat:` error line and no rows (unit).
- **AC-003.4**: Page is reachable from the Appbar nav item `testimonials` (lowercase) with `aria-current="page"` when active (e2e, `AGENTS.md:46-47`, `153`).

### REQ-004 — Harness compliance (static rules)
- **AC-004.1**: No `rounded-*` outside status dots, no hex colors or `neutral-*` classes in `src/` components (`AGENTS.md:31-33`, `39-41`, `310`). Proven by a unit test that scans `src/` (`harness-rules.test.ts`).
- **AC-004.2**: Decorative scanlines are `aria-hidden`; nav links have `aria-label`/`aria-current`; focus ring uses the accent token (`AGENTS.md:44-47`). e2e keyboard assertion: tabbing to the nav item shows an outline using `--accent`.
- **AC-004.3**: Reduced motion: under `prefers-reduced-motion: reduce` the page shows the same content with no running animation (e2e emulation).

### REQ-005 — Reproducible checks
Checks `unit`, `lint`, `typecheck`, `build`, `integration`, `e2e` are declared in `terminal-portfolio/devos.env.yaml` and published with `recipe publish` before first execution. Unit/integration/e2e report `junit-xml`.
- **AC-005.1**: `devos gates` no longer reports the checks as unavailable after publication.

## Assumptions

- **A1**: Identity values (name, handle, email, socials) are placeholders from `prompt:21-23` ("Test User", `testuser`) until the person supplies real ones; testimonials content is sample data clearly marked as placeholder in the data file comment. Ticker is omitted (its `STATS` must be true claims, `AGENTS.md:154-155`).
- **A2**: Amber palette (default).
- **A3**: No backend, database or external service: testimonials are static data. `data.isolation: fresh` does not apply; AC-003.3 is a pure unit case.
- **A4**: Live GitHub ticker fetch (`AGENTS.md:241-246`) is out of scope.

## Open questions

- **Q1 (resolved, S2)**: Surface = new `/testimonials` page.
- **Q2 (resolved, S2 + S4)**: Scaffold the app in `terminal-portfolio`.
- **Q3 (resolved)**: No design pass; the harness fully specifies tokens, command headers, list rows and typography.
- **Q4 (recorded)**: No constitution exists at `.hub/.specify/memory/constitution.md`. Constitution check = N/A (absent). Not blocking; the harness is the governing rule set.
