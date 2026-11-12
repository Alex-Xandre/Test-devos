# Package `e2e` — T006 + T007 (terminal-portfolio)

Your input commit has the full feature: scaffold, `/testimonials` page, unit and integration tests, `playwright.config.ts` with an `e2e` project (chromium, `testDir: tests/e2e`, `baseURL` from `BASE_URL`, junit reporter via `PLAYWRIGHT_JUNIT_OUTPUT_NAME`). Read `AGENTS.md` (rules 9 and 10 especially), `src/components/appbar.tsx`, `src/components/container.tsx`, `src/app/globals.css` and `src/app/(features)/testimonials/page.tsx` before writing. Requirements `REQ-003`, `REQ-004`.

## Ownership

You own ONLY `tests/e2e/` (subtree, relative to `terminal-portfolio/`). You must not edit `playwright.config.ts` or any `src/` file: set viewport and reduced motion per test with `test.use` / `browser.newContext`. If something in `src/` or a config must change for a criterion to pass, flag it precisely (file, line, what, which AC) in your result — do not change it. The e2e check child runs your spec against the platform preview on the joined candidate; your local run is the development proof.

## T006 — `tests/e2e/testimonials.spec.ts` (chromium, no stand-ins, no mocks)

Header comment: `// T006 T007 — target: http, component: web, browser: chromium — AC-003.4, AC-004.2, AC-004.3`. Import `SHELL` from the site constants (relative import if `@/` does not resolve under Playwright).

1. **Navigation (AC-003.4)**: `page.goto("/")`; click the nav link with accessible name/`aria-label` for `testimonials` (role `link`, within `nav[aria-label="primary"]`); expect URL to end with `/testimonials`; expect the command header text `${SHELL} $ cat testimonials/*.md` (normalise whitespace); expect that nav link to have `aria-current="page"` and the `~` link not to.
2. **Keyboard focus ring (AC-004.2)**: on `/testimonials`, press `Tab` until the active element is the `testimonials` nav link (bounded loop ≤ 10); compute `getComputedStyle(el).outlineColor` and compare with the resolved `--accent` token (`getComputedStyle(document.documentElement).getPropertyValue("--accent")` → normalise both to `rgb(r, g, b)` via a canvas/`new Option().style.color` trick or by parsing hex). Also assert `outlineStyle !== "none"` and `outlineWidth !== "0px"`.
3. **Decorative scanlines (AC-004.2)**: `.scanlines[aria-hidden="true"]` count is 1.
4. **Reduced motion (AC-004.3)**: new context with `reducedMotion: "reduce"`, goto `/testimonials`; same row count (`li`) as the default context and same header text; `document.getAnimations().length === 0` after `page.waitForLoadState("networkidle")` plus a 500ms settle; the container is visible (opacity 1).
5. **Screenshots (visual evidence)**: viewport 375×812 and 1280×800, `page.screenshot({ path: "reports/screenshots/testimonials-mobile.png", fullPage: true })` and `reports/screenshots/testimonials-desktop.png` (create the directory with `node:fs` `mkdirSync(..., { recursive: true })` first). Also capture `reports/screenshots/home-desktop.png` and `reports/screenshots/not-found-desktop.png` (`/unknown`). Then, if an `evidence` command is on PATH in your pod, copy the four PNGs to a directory OUTSIDE every repository folder (e.g. `/tmp/evidence/specs/spec/004-show-description/evidence/`) and run `evidence upload <path>` for each; cite the resulting paths in your result. Never commit PNGs into the repository or into `/workspace/specs` (the hub); evidence lives in devOS. If `evidence` is unavailable, say so; the check child's `artifacts` glob (`reports/screenshots/**`) carries them.
6. **No horizontal overflow at 375px**: `document.documentElement.scrollWidth <= window.innerWidth`.

Keep tests independent and deterministic; no `waitForTimeout` beyond the 500ms settle in (4).

## T007 — harness consistency pass (verify; flag, don't fix outside your paths)

From `terminal-portfolio/` run and record: `git grep -n "neutral-" -- src` (expect no output); `git grep -n "Next JS\|NextJS" -- src README.md` (expect none); `npx tsc --noEmit` (0); `npm run build` (0); `npx vitest run` (green); `npx eslint .` (0); confirm `.gitignore` covers `*.tsbuildinfo`, `reports/`, `test-results/`, `.next/`, `node_modules/` (`git check-ignore -q tsconfig.tsbuildinfo reports/x test-results/x`); confirm terminal chrome is lowercase (grep `className` lines in `src/` for capitalised label text in nav/command headers). Report every finding with file:line; do not modify files outside `tests/e2e/`.

## Proof before you declare

`npm ci`; `npx playwright install chromium` if needed; `npm run build && (npm run start -- -p 3000 &)`; `BASE_URL=http://localhost:3000 npx playwright test tests/e2e --reporter=list` green — paste the summary and the screenshot paths. Commit only `tests/e2e/**`. Declare with `devos runs declare "<summary: e2e cases and result, screenshot paths/evidence uploads, T007 findings>"`. Do not ask questions; flag them in the result.
