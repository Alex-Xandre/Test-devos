# Design: 004-show-description — testimonials page

**Branch**: `spec/004-show-description` | **Repository**: `terminal-portfolio` | **Base**: `main`
**Inputs**: `requirements.md` (sha256 `ee5d64b1…`, verified), `plan.md` (sha256 `3a41e262…`, verified) — read-only, unchanged.
**Mode**: canvas (switched from live in loop 1; reason recorded by `design-mode`).
**Status**: round 1 published — **awaiting the person's judgment** (direction A vs B, and Q1–Q4 below).
**History**: loop 1, attempt `ss_spec_004-show-description_1794271597516_3`.

## 1. Why this round exists, and why it is small

The plan routed design → implement ("the harness specifies every visual element"). That is true of
the *vocabulary* (tokens, command header, dashed rows, `cd` links, 404) but the harness has no
testimonials pattern: the shell idiom (`cat testimonials/*.md`), the row header line, the quote
treatment and the `./open --link` affordance were composed at plan time (plan D2) and nobody has seen
them. The design gate ("approve the visual design before it is built") belongs to a person, so this
round shows the composition once, at both viewports, with one alternative, and asks for a decision.
Nothing beyond the bound scope is proposed; no backend, no new tokens, no new features.

## 2. Working surface and its limits

- **No app code exists on this branch** (`package.json`, `src/`, `devos.env.yaml` absent) — live mode
  had nothing to serve and a mock could not be layered on a running app. Scaffolding Next.js here
  would have pre-empted the plan's tests-first order (T001 → T003/T004 red → T005), so the round is
  a **plain-HTML canvas** at `specs/spec/004-show-description/canvas/`, built from the harness token
  block and IBM Plex Mono/Sans (latin woff2 bundled beside the pages; canvas pages cannot reach the
  network). It is a static mock, **not a working implementation**.
- Canvas pages let the document scroll; the real layout locks `<main>` to `h-screen` and scrolls an
  inner region (`AGENTS.md:163-166`). Visually identical in the viewport; noted so nobody reads the
  canvas as the scroll model.
- No "before" exists (`design-compare status`: nothing frozen; comparison is not available in canvas
  mode). Evidence is the canvas screenshots below.
- Box-drawing glyphs (`└──`) fall back to a system font in the canvas because the latin woff2 subset
  lacks U+2514. `next/font/google` with `subsets: ['latin']` behaves the same, as it does on the
  reference site; acceptable, recorded.

## 3. Screens

### 3.1 `/testimonials` — direction A (recommended): dashed file list — `canvas/index.html`

Framed as the output of `cat testimonials/*.md`; one dashed-border row per file, the list idiom the
harness reserves for text lists (`AGENTS.md:211`).

| # | Element | Spec (canvas class → Tailwind the implementer writes) |
|---|---|---|
| 1 | Appbar | fixed, `border-b border-border bg-background`; inner `mx-auto w-full max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between flex-nowrap whitespace-nowrap`. Left: 6px positive dot (`rounded-full bg-positive`, `--glow-positive`, `aria-hidden`) + `{SHELL}` with `@sh:~` in `text-text-secondary` (`.handle`). Right: nav `text-[13px] text-text-secondary hover:text-accent`, active `text-accent` + `aria-current="page"` (`.nav`). Two items fit inline at 375px, so no burger yet (D4). |
| 2 | Command header | exactly `AGENTS.md:179-184`: `<p class="text-sm text-accent-muted">{SHELL} $ <span class="text-accent">cat testimonials/*.md</span></p>` (`.cmd`). |
| 3 | Subtitle | `<p class="mt-1.5 text-xs text-text-secondary">notes from people i've shipped with — quoted as sent.</p>` (`.sub`). Copy is lowercase, first person, specific (rule 10). |
| 4 | Row header | `<p class="flex flex-wrap gap-x-2 gap-y-0.5 text-[13px]">`: `{slug}.md` in `text-accent-muted` (`basis-full sm:basis-auto`, with ` ·` appended via `sm:after:content-[' ·']` or a `hidden sm:inline` span); then `<span class="font-medium text-text-primary">{name}</span><span class="text-text-secondary">, {role}[ @ {company}]</span><span class="text-text-secondary whitespace-nowrap">[ · {year}]</span>` (`.file-h`). Separators render only when the part exists (AC-003.2). Below `sm` the file name takes its own line and the year stays glued to the text before it — fixes the orphaned `· 2025` seen in the first capture. |
| 5 | Quote | `<p class="mt-2 max-w-[65ch] font-sans text-sm leading-relaxed text-text-primary">` (`.quote`). Sans because a human reads it (rule 3); 65ch keeps 1280px lines readable. |
| 6 | Optional link | ghost button text `./open --link` — `<a class="mt-2 inline-block text-xs text-text-secondary hover:text-accent" target="_blank" rel="noreferrer">` (`.ghost`). Rendered only when `link` exists; same label everywhere (`AGENTS.md:248-252`). |
| — | List | `<ul class="mt-8 border-t border-dashed border-border">`, rows `<li class="border-b border-dashed border-border py-4">` (`.files`). |
| — | Container | `<Container className="flex-col overflow-hidden pt-12 md:pt-16 min-h-[calc(100dvh-100px)]">` (`AGENTS.md:173-174`); fade-up disabled under reduced motion. |

Row 2 shows the no-company case (no dangling `@`), row 3 the no-year case (no trailing `·`).

### 3.2 `/testimonials` — direction B (alternative): literal file output — `canvas/testimonials-alt.html`

Same frame and header. Each file is a document, not a row: a `# testimonials/{slug}.md` comment
line (`#` in accent-muted, path in text-secondary — the stacks note idiom, `AGENTS.md:233-234`), the
quote as a markdown blockquote (`border-l-2 border-l-accent-muted pl-3 font-sans text-sm`, the
harness's own markdown blockquote style, `AGENTS.md:260-264`), attribution `— name, role @ company ·
year` in mono below, optional `./open --link`. Files are separated by whitespace (`gap-7`), no
dashed borders.

**Why A is recommended**: A scans — name and file name are the first thing on each row, three
testimonials fit a 1280×800 viewport without scrolling, and it keeps the harness's list convention
(dashed = text list) so a future blog list looks like a sibling. B reads as a document and is more
literally "what `cat` prints", but is ~20% taller, and its attribution comes *after* the quote, so a
visitor reads before knowing who is speaking. Choose B if the page should feel like a letter rather
than a listing.

### 3.3 `/testimonials` — empty state — `canvas/testimonials-empty.html`

Header + subtitle unchanged, then `<p class="mt-8 text-sm text-text-secondary">cat: testimonials/*.md:
No such file or directory</p>`, no `<ul>` (AC-003.3, `AGENTS.md:199-200`).

### 3.4 `/` — minimal home — `canvas/home.html`

`{SHELL} $ whoami` (plain — the typed `whoami --verbose` hero is a later feature), subtitle `test user
· backend engineer · the rest of this directory is still being written.` (placeholder identity, A1),
then `cd /testimonials →` as `mt-8 text-sm text-accent hover:text-accent-hover` (`AGENTS.md:192-194`).
Nav item `~` carries `aria-current="page"` here.

### 3.5 `/unknown` — 404 — `canvas/not-found.html`

Per `AGENTS.md:298-302`: `{SHELL} $ cd /unknown` (command header colours), `bash: cd: /unknown: No
such file or directory` in text-primary, a tree of real routes from `SIDEBAR_MENU` (`~/`,
`└── testimonials/`, branch glyph accent-muted, entries are links), `cd ~` in accent, `process exited
127` in `text-xs text-text-secondary`. The harness's "open a shell" button is **omitted** because the
interactive shell is out of scope (requirements, task-plan `scope.out`) — Q3 below.

## 4. Decisions (this round)

- **D1 — Row header format** `{slug}.md · {name}, {role}[ @ {company}][ · {year}]`, as planned, with
  colour roles: slug accent-muted, name text-primary 500, the rest text-secondary. Rationale: the
  file name is chrome, the name is the subject, role/company/year are metadata.
- **D2 — Quote treatment (A)**: plain sans paragraph, no blockquote rule, 65ch max. The rule is the
  thing that distinguishes B; A keeps rows quiet.
- **D3 — Scroll region offset `mt-14`, not `mt-20`**: the harness's `mt-20` (`AGENTS.md:166`) budgets
  for the ticker strip inside the fixed header; the ticker is out of scope (A1), so `mt-20` would
  leave a 24px dead band. Restore `mt-20` when the ticker lands. Implementer: appbar row `h-14`.
- **D4 — Mobile nav inline, no burger yet**: the harness's `lg` burger (recipe step 4) exists because
  a full mono nav overflows; with two items (`~`, `testimonials`) the row fits at 375px with
  `whitespace-nowrap`. Add the burger when the nav grows. Restraint over scaffolding (`AGENTS.md:17`).
- **D5 — Placeholder content**: three sample testimonials with distinct, non-generic names and dry
  quotes; the data file must carry a "replace before publishing" comment (A1, R2). No real claims.
- **D6 — Footer not shown**: the plan's file layout has no footer component and REQ-001 does not list
  it; the canvas ends with the container. Recorded, not decided (Q4).

## 5. States, accessibility, responsive

- **Hover**: nav items and `./open --link` → `text-accent`; `cd` links → `text-accent-hover`. Rows
  themselves are not links and do not translate (that is the projects idiom, `AGENTS.md:203-206`).
- **Focus**: `focus-visible:outline-1 outline-accent outline-offset-2` on every interactive element
  (AC-004.2); evidence `round-1-index-desktop-focus.png` shows the ring on the active nav item.
- **Reduced motion**: Container fade-up is the only animation; `prefers-reduced-motion: reduce` sets
  `animation: none` (AC-004.3). No typing, ticker or cat in this scope.
- **Decorative**: `.scanlines` is `aria-hidden`, z-0 behind content (AC-004.2). Status dot `aria-hidden`.
- **Semantics**: nav links carry `aria-label`/`aria-current`; routes tree is a `<ul aria-label="routes">`.
- **Contrast** (on `#0d0b07`): text-primary `#e9e1d2` 15.0:1; text-secondary `#8f8574` 5.1:1; accent
  `#f2a33c` 9.1:1; accent-muted `#9a7440` 4.5:1 (prompt/slug chrome, ≥ 4.5 at 13–14px).
- **Responsive**: one alignment system (`max-w-5xl px-4 sm:px-6`); at 375px the row header stacks
  (slug line, who-line), quotes wrap at container width; no horizontal overflow at 375px (checked in
  the mobile captures).
- **Loading / error**: static data, server-rendered; the only error-shaped state is the empty state.

## 6. Evidence (uploaded with `evidence upload`; paths are under `specs/spec/004-show-description/evidence/`)

| File | What |
|---|---|
| `round-1-index-desktop.png` | Direction A, 1280×800 |
| `round-1-index-desktop-annotated.png` | Direction A with numbered callouts 1–8 (matches table 3.1) |
| `round-1-index-desktop-focus.png` | Direction A, keyboard focus ring on the active nav item |
| `round-1-index-mobile.png` | Direction A, 375×812 full page (after the row-header wrap fix) |
| `round-1-testimonials-alt-desktop.png` / `-annotated.png` / `-mobile.png` | Direction B |
| `round-1-testimonials-empty-desktop.png` / `-mobile.png` | Empty state |
| `round-1-home-desktop.png` / `-mobile.png` | Minimal home |
| `round-1-not-found-desktop.png` / `-annotated.png` / `-mobile.png` | 404 |

Platform-stored per-page screenshots are also registered by `design-canvas publish` (round 1).

## 7. Criterion mapping

| Criterion | Where it is visible in this round |
|---|---|
| AC-001.2 | home: `cd /testimonials →`; 404: `No such file or directory`, `process exited 127` |
| AC-001.3 | pages are `<html lang="en" class="dark">`, `theme-color #0d0b07` |
| AC-003.1 | 3 rows, name + full quote, quote in Plex Sans (index) |
| AC-003.2 | rows 2 and 3 (no `@`, no trailing `·`) |
| AC-003.3 | testimonials-empty |
| AC-003.4 | nav `testimonials` with `aria-current="page"` on index/alt/empty |
| AC-004.1 | canvas uses tokens only; the single `rounded-full` is the status dot |
| AC-004.2 | scanlines `aria-hidden`; focus ring evidence |
| AC-004.3 | reduced-motion block in `styles.css` |

## 8. Open questions for the person

- **Q1 — Direction**: A (dashed file list, recommended) or B (literal file output)?
- **Q2 — Row metadata**: keep `{slug}.md` visible in the row (it is the `cat` conceit), or show only
  `name, role @ company · year`? The plan and tests assume the slug is shown.
- **Q3 — 404 "open a shell" button**: omit until the shell feature exists (recommended, D6/§3.5), or
  keep a non-functional label now? (Recommend omit — a button that does nothing is an addition.)
- **Q4 — Footer**: the harness layout ends every page with the footer (`process exited 0 · © …`).
  It is not in REQ-001 or the plan's file layout. Leave it for a later feature (recommended; the
  plan would otherwise need a return) or ask plan to add it?

Anything else in this round is implementable as drawn; the tables in §3 are the hand-off spec.

## 9. Round history

- **Round 1** (loop 1): canvas created — five pages, two directions, evidence captured at 1280×800
  and 375×812; first mobile capture showed an orphaned `· {year}` in the row header, fixed before
  publishing (see §3.1 row 4). Published with `design-canvas publish`; held for the person.
