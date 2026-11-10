# Package `scaffold` — T001 + T002 (terminal-portfolio)

You scaffold a **minimal** Next.js App Router + Tailwind v4 app in the `terminal-portfolio` repository by following its harness, `AGENTS.md` (read it fully first; it wins over habit), and you declare the repository's check recipe. Nothing exists yet: the folder holds only `AGENTS.md`, `README.md`, `prompt`, `CLAUDE-import.md`.

Design round 1 is approved (`specs/spec/004-show-description/design.md` if you can read it; its decisions are restated here). Requirements: `REQ-001`, `REQ-004`, `REQ-005`.

## Scope and ownership

You own ONLY these paths (relative to `terminal-portfolio/`): `package.json`, `package-lock.json`, `.gitignore`, `.npmrc`, `next.config.ts`, `tsconfig.json`, `next-env.d.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `vitest.config.ts`, `playwright.config.ts`, `devos.env.yaml`, `public/`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/not-found.tsx`, `src/app/fonts/`, `src/lib/`, `src/components/container.tsx`, `src/components/appbar.tsx`, `src/components/command-header.tsx`, `tests/setup.ts`, `tests/unit/harness-rules.test.ts`, `tests/unit/layout.test.tsx`.

Do NOT create the testimonials route, data, row component, integration or e2e specs — a later package owns `src/app/(features)/`, `src/components/testimonial-row.tsx`, `tests/integration/`, `tests/e2e/`. Do not touch `AGENTS.md`, `README.md`, `prompt`. Out of scope: hero typing animation, projects, blog, stacks, experience, trading, interactive shell, ticker, footer, cat, theme toggle, live GitHub stats, decorative images, burger menu.

## Tests first (expected red, then green)

1. `tests/unit/harness-rules.test.ts` — header comment: `// T001 T002 T007 — AC-004.1 (AGENTS.md rules 4, 7)`. Scans every file under `src/**/*.{ts,tsx,css}` (use `node:fs` + a small recursive walk, no glob dependency):
   - no hex color literal `/#[0-9a-fA-F]{3,8}\b/` in any file except `src/app/globals.css`; the single exemption is a line containing `themeColor` in `src/app/layout.tsx` (AGENTS.md:91-92 requires the literal there) — assert that exemption is used at most once;
   - no `neutral-` anywhere under `src/`;
   - every `rounded-` occurrence is exactly `rounded-full` AND the same line contains `status-dot` (the Appbar status dot is the only allowed rounded element).
2. `tests/unit/layout.test.tsx` — header comment `// T001 — AC-001.3, AC-004.2`. Render `RootLayout` (or assert on its exported pieces if rendering `<html>` under jsdom is impractical: in that case render `Appbar` and assert the scanlines markup from a small exported `Scanlines` component). Must assert: the layout's root `<html>` has `lang="en"` and class `dark`; a `.scanlines` element has `aria-hidden="true"`; exported `viewport.themeColor === "#0d0b07"`; `metadata.title` is a non-empty string.
3. Run `npx vitest run` → red (modules missing). Then build the scaffold so both files go green.

## Tooling (pin exact versions; commit `package-lock.json`)

- `npm init -y` then install: `next@15` (latest 15.x), `react@19`, `react-dom@19`, `tailwindcss@4`, `@tailwindcss/postcss@4`, `motion` (latest 12.x or newer stable), `typescript@5`, `@types/node`, `@types/react`, `@types/react-dom`, `vitest@3` (latest 3.x), `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@playwright/test@1.59.1` (matches the pod's installed Playwright; do not use a newer major/minor), `eslint@9`, `eslint-config-next@15`, `eslint-formatter-junit`. Save exact versions (`npm install --save-exact`).
- `package.json` scripts: `dev: next dev`, `build: next build`, `start: next start`, `lint: eslint .`, `typecheck: tsc --noEmit`, `test: vitest run`, `test:integration: playwright test tests/integration`, `test:e2e: playwright test tests/e2e`. Add `"engines": { "node": ">=20" }`.
- `.gitignore`: `node_modules/`, `.next/`, `out/`, `*.tsbuildinfo`, `next-env.d.ts` is COMMITTED (not ignored), `reports/`, `test-results/`, `playwright-report/`, `.env*.local`.
- `tsconfig.json`: Next 15 defaults (`strict: true`, `paths: { "@/*": ["./src/*"] }`, `jsx: preserve`, `moduleResolution: bundler`, include `tests/**/*` too so test files typecheck).
- `eslint.config.mjs`: flat config using `eslint-config-next` (core-web-vitals + typescript); ignore `.next/`, `node_modules/`, `reports/`, `test-results/`, `playwright-report/`. `npx eslint . -f junit -o reports/lint.xml` must exit 0.
- `vitest.config.ts`: `@vitejs/plugin-react`, `environment: "jsdom"`, `setupFiles: ["tests/setup.ts"]` (imports `@testing-library/jest-dom/vitest`), `include: ["tests/unit/**/*.test.{ts,tsx}"]`, alias `@` → `src`, `css: false`. The CSS import in layout must not break jsdom (mock `*.css` via `css: false` or a `vi.mock`), and `next/font/local` must not break tests (if needed, mock `next/font/local` in `tests/setup.ts` to return `{ className: "", variable: "--font-plex-mono" }`-shaped objects).
- `playwright.config.ts`: `testDir: "tests"`, `fullyParallel: true`, `retries: 0`, `outputDir: "test-results"`, `reporter: [["list"], ["junit", { outputFile: process.env.PLAYWRIGHT_JUNIT_OUTPUT_NAME ?? "reports/playwright.xml" }]]`, `use: { baseURL: process.env.BASE_URL ?? process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000", trace: "retain-on-failure", screenshot: "only-on-failure" }`, projects: `{ name: "integration", testDir: "tests/integration" }` (request API only, no browser launch), `{ name: "e2e", testDir: "tests/e2e", use: { ...devices["Desktop Chrome"], browserName: "chromium" } }`. NO `webServer` block: checks run against the platform preview. Create empty placeholder dirs only if Playwright requires them — otherwise do not create `tests/integration` or `tests/e2e` (another package owns them).
- `postcss.config.mjs`: `{ plugins: { "@tailwindcss/postcss": {} } }`. `next.config.ts`: minimal (`reactStrictMode: true`).

## devos.env.yaml (T002, REQ-005) — this exact shape validates against the backend

```yaml
components:
  - name: web
    command: npm ci && npm run build && npm run start -- -p 3000
    port: 3000
    health: /
checks:
  unit:
    command: npx vitest run --reporter=junit --outputFile=reports/unit.xml
    target: none
    report: { format: junit-xml, kind: tests, path: reports/unit.xml }
  lint:
    command: npx eslint . -f junit -o reports/lint.xml
    target: none
    report: { format: junit-xml, kind: tests, path: reports/lint.xml }
  typecheck:
    command: npx tsc --noEmit
    target: none
  build:
    command: npm run build
    target: none
  integration:
    command: npx playwright test tests/integration --reporter=junit
    target: http
    component: web
    env: { BASE_URL: "${preview:url}", PLAYWRIGHT_JUNIT_OUTPUT_NAME: reports/integration.xml }
    report: { format: junit-xml, kind: tests, path: reports/integration.xml }
  e2e:
    command: npx playwright test tests/e2e --reporter=junit
    target: http
    component: web
    setup: npx playwright install chromium
    env: { BASE_URL: "${preview:url}", PLAYWRIGHT_JUNIT_OUTPUT_NAME: reports/e2e.xml }
    report: { format: junit-xml, kind: tests, path: reports/e2e.xml }
    artifacts: [ "reports/screenshots/**", "test-results/**" ]
preparation:
  none: true
```

Every check's `cwd` defaults to the repository root (this folder). Keep `${preview:url}` literally (it is a platform token). If a check needs `npm ci` before running in a clean checkout, add `setup: npm ci` to EACH check that lacks setup (and `setup: npm ci && npx playwright install chromium` for e2e) — do this: clean checkouts have no `node_modules`. Validate with `recipe --validate devos.env.yaml` (run from this folder) and fix until it exits 0; include its output in your result. If `recipe publish` exists in your pod, run it from this folder after committing and report the outcome (a refusal is evidence, not a failure); the orchestrator publishes again after join.

## The scaffold (recipe steps 2–4 + minimal home + 404)

Follow `AGENTS.md` exactly for class strings and markup. Design decisions you must honour: Appbar row `h-14`; scroll region `mt-14` (the harness's `mt-20` budgets for a ticker that is out of scope); no burger — the two nav items fit inline with `whitespace-nowrap`; no footer; no "open a shell" button on the 404.

- `src/app/globals.css`: `@import "tailwindcss";` then the amber `:root` token block from AGENTS.md:56-74 **verbatim**, mirrored in `.dark`; `@theme inline { --color-background: var(--background); --color-foreground: var(--foreground); --color-text-primary: var(--text-primary); --color-text-secondary: var(--text-secondary); --color-border: var(--border); --color-secondary-background: var(--secondary-background); --color-secondary-background-hover: var(--secondary-background-hover); --color-secondary-border: var(--secondary-border); --color-accent: var(--accent); --color-accent-hover: var(--accent-hover); --color-accent-muted: var(--accent-muted); --color-positive: var(--positive); --color-negative: var(--negative); --font-mono: var(--font-plex-mono), ui-monospace, monospace; --font-sans: var(--font-plex-sans), system-ui, sans-serif; }`; `html { color-scheme: dark; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }` + webkit scrollbar rules (8px, transparent track, `var(--border)` thumb with `border-radius: 0`, hover `var(--secondary-border)`, transparent corner); `body { background: var(--background); color: var(--foreground); }`; `:focus-visible { outline: 1px solid var(--accent); outline-offset: 2px; }`; `.scanlines { pointer-events: none; background: repeating-linear-gradient(to bottom, transparent 0 3px, rgb(0 0 0 / 0.12) 3px 4px); opacity: 0.4; }`; `.status-dot { box-shadow: var(--glow-positive); }`; `.cursor-block` + `@keyframes blink` + `@keyframes tick` utilities (unused yet but part of the harness's globals); and `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }`.
- Fonts: if `/workspace/specs/spec/004-show-description/canvas/fonts/*.woff2` is readable from your pod, copy the five files to `src/app/fonts/` and load them with `next/font/local` (Plex Mono 400/500/600 + 400 italic → variable `--font-plex-mono`; Plex Sans 400 → `--font-plex-sans`). Otherwise use `next/font/google` (`IBM_Plex_Mono` weights 400/500/600 + italic, `IBM_Plex_Sans` 400/500) with the same variables. Say which you used.
- `src/lib/site.ts`: `export const SHELL = "testuser@sh:~"`, `SITE_URL = "https://example.com"`, `EMAIL = "test@example.com"`, `CALENDLY = null`, `SOCIALS = [{ label: "github", href: "https://github.com/testuser" }]`, `NAME = "Test User"`, `ROLE = "backend engineer"` — placeholder identity from `prompt:21-23`; comment: `// placeholder identity — replace before publishing`. Components read identity ONLY from here.
- `src/app/layout.tsx`: `export const metadata` (title `testuser@sh:~`, description one dry line) and `export const viewport = { themeColor: "#0d0b07" }`; `<html lang="en" className={`dark ${mono.variable} ${sans.variable}`}>`; body: `<div className="scanlines fixed inset-0 z-0" aria-hidden="true" />` then `<main className="relative z-10 flex h-screen flex-1 flex-col overflow-hidden font-mono">` containing `<Appbar />` and `<div className="mt-14 flex-1 overflow-y-auto">{children}</div>`.
- `src/components/container.tsx` (client, `motion`): `<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>` when `animate !== false`, base class `mx-auto flex w-full max-w-5xl px-4 sm:px-6` + `className`. Respect `useReducedMotion()` from `motion/react`: when reduced, render without animation props.
- `src/components/appbar.tsx` (client, `usePathname`): `export const SIDEBAR_MENU = [{ href: "/", label: "~" }, { href: "/testimonials", label: "testimonials" }] as const;` header `fixed inset-x-0 top-0 z-20 border-b border-border bg-background`; inner `mx-auto flex h-14 w-full max-w-5xl flex-nowrap items-center justify-between whitespace-nowrap px-4 sm:px-6`; left: `<Link href="/" aria-label="home">` with `<span aria-hidden="true" className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-positive" />` + `testuser` in text-primary and `@sh:~` in text-secondary (derive from `SHELL`); right: `<nav aria-label="primary">` with one `<Link>` per item, `text-[13px] text-text-secondary hover:text-accent`, active (`pathname === href` for `/`, `pathname.startsWith(href)` otherwise) adds `text-accent` and `aria-current="page"`; every link has `aria-label`.
- `src/components/command-header.tsx` (server): props `{ command: string; subtitle?: string }` → exactly `<p className="text-sm text-accent-muted">{SHELL} $ <span className="text-accent">{command}</span></p>` and, when subtitle, `<p className="mt-1.5 text-xs text-text-secondary">{subtitle}</p>`.
- `src/app/page.tsx` (server): `<Container className="flex-col overflow-hidden pt-12 md:pt-16 min-h-[calc(100dvh-100px)]">` with `<CommandHeader command="whoami" subtitle="test user · backend engineer · the rest of this directory is still being written." />` and `<Link href="/testimonials" className="mt-8 text-sm text-accent hover:text-accent-hover" aria-label="cd /testimonials">cd /testimonials →</Link>` (the literal text `cd /testimonials →` must appear in the HTML).
- `src/app/not-found.tsx` (client, `usePathname`): inside `Container`: `<p className="text-sm text-accent-muted">{SHELL} $ <span className="text-accent">cd {pathname}</span></p>`, `<p className="mt-2 text-sm text-text-primary">bash: cd: {pathname}: No such file or directory</p>`, a `<ul aria-label="routes">` tree built from `SIDEBAR_MENU` (`~/` then `└── testimonials/`, glyph in text-accent-muted, entries are `Link`s), `<Link href="/" className="mt-6 text-sm text-accent hover:text-accent-hover">cd ~</Link>`, `<p className="mt-8 text-xs text-text-secondary">process exited 127</p>`. Next must serve this with status 404 for `/unknown`.

Lowercase for all terminal chrome. Naming `Next.js`. No `neutral-*`, no hex outside globals.css (except themeColor), no `rounded-*` except the status dot.

## Proof before you declare

Run from `terminal-portfolio/`: `npx vitest run --reporter=junit --outputFile=reports/unit.xml` (green), `npx eslint . -f junit -o reports/lint.xml` (exit 0), `npx tsc --noEmit` (exit 0), `npm run build` (exit 0), `recipe --validate devos.env.yaml` (exit 0). Then `npm run start -- -p 3000` briefly and curl `/` (200, contains `testuser@sh:~` and `cd /testimonials →`) and `/unknown` (404, contains `No such file or directory` and `process exited 127`); paste the curl evidence in your result. Commit everything you own (including `package-lock.json`, `next-env.d.ts`, fonts), never `node_modules/`, `.next/`, `reports/`. Declare with `devos runs declare "<summary: files, test counts, check exit codes, fonts source, recipe validate/publish outcome>"`. Flag, do not ask, anything you could not do.
