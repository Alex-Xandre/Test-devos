# Package `testimonials` — T003 + T004 + T005 (terminal-portfolio)

The scaffold exists on your input commit: Next.js 15 App Router + Tailwind v4, `src/lib/site.ts` (`SHELL`), `src/components/{container,appbar,command-header}.tsx`, Vitest (`tests/unit`, jsdom, RTL), Playwright (`playwright.config.ts` with projects `integration` and `e2e`, `baseURL` from `BASE_URL`), ESLint, and `devos.env.yaml`. Read `AGENTS.md` fully (it wins over habit), then the existing components, before writing anything. Requirements `REQ-001..REQ-003`; design round 1 (direction A, approved) is restated below.

## Ownership

You own ONLY (relative to `terminal-portfolio/`): `src/app/(features)/` (subtree), `src/components/testimonial-row.tsx`, `tests/unit/testimonials-data.test.ts`, `tests/unit/testimonials-page.test.tsx`, `tests/integration/` (subtree). Do not modify any other file; if the scaffold blocks you (e.g. a config gap), work around it inside your files when possible, otherwise flag exactly which file needs what change in your result.

## Order: tests first, record red, then implement

### T003 — unit tests (expected red: modules missing)

- `tests/unit/testimonials-data.test.ts` — header `// T003 T005 — AC-002.1, AC-002.2`. Imports `TESTIMONIALS` and the `Testimonial` type from `@/app/(features)/testimonials/testimonials-data`. Asserts: ≥ 1 entry; slugs non-empty, unique, kebab-case; every `name` and `quote` non-empty; every `link`, when present, starts with `https://`.
- `tests/unit/testimonials-page.test.tsx` — header `// T003 T005 — AC-003.1, AC-003.2, AC-003.3`. Render the list the page renders with injectable data: export from the page module a `TestimonialsList({ items }: { items: Testimonial[] })` component (the default page renders `<TestimonialsList items={TESTIMONIALS} />`), and test THAT with fixtures: (a) 3 fixtures → exactly 3 `li`, each containing its name and full quote, each quote `<p>` has class `font-sans`; (b) a fixture without `company` and without `year` → its row header text contains no ` @ ` and does not end with `·` (trim) and contains no `··`; (c) `items = []` → the text `cat: testimonials/*.md: No such file or directory` is present and there are 0 `li`. Also render `TestimonialRow` directly for (b) if simpler.

Run `npx vitest run --reporter=junit --outputFile=reports/unit.xml`; keep the red summary for your result.

### T004 — integration specs (Playwright request API, no browser, no mocks)

In `tests/integration/`, specs run against `BASE_URL` (the platform preview or your local `npm run start`). File header comment on each: `// T004 T005 — target: http, component: web — AC-001.2, AC-001.3, AC-003.1`.
- `tests/integration/pages.spec.ts`: `GET /` → 200, body contains `testuser@sh:~` (import `SHELL` from `@/lib/site` instead of hardcoding) and `cd /testimonials →`; `<html lang="en"` and `class="dark` present; `<meta name="theme-color" content="#0d0b07"`; `GET /unknown` → 404 and body contains `bash: cd: /unknown: No such file or directory` and `process exited 127` (note: the 404 page is a client component that reads `usePathname`; if the SSR HTML carries the pathname this passes directly — verify, and if it does not, assert `No such file or directory` and `process exited 127` only, and say so).
- `tests/integration/testimonials.spec.ts`: `GET /testimonials` → 200; imports the real `TESTIMONIALS` and asserts every `name` and every `quote` appears in the HTML (HTML-escape apostrophes/quotes before comparing, or compare after decoding entities); header text `cat testimonials/*.md` present; `aria-current="page"` present on the testimonials nav link in the SSR HTML.

Use `@playwright/test`'s `request` fixture (`request.get(...)`). Path aliases: if Playwright cannot resolve `@/…` imports, use relative imports (`../../src/…`). Expected red before T005: `/testimonials` is 404.

### T005 — implement (then unit + integration go green)

- `src/app/(features)/testimonials/testimonials-data.ts`: `export type Testimonial = { slug: string; name: string; role: string; company?: string; quote: string; year?: number; link?: string };` and `export const TESTIMONIALS: Testimonial[]` with three placeholder entries, preceded by `// placeholder sample testimonials — replace before publishing`. Entry 1 has company + year + link; entry 2 has NO company (role only) but a year; entry 3 has company but NO year. Distinct, non-generic names; dry, specific, first-person quotes (2–3 sentences each). No real people.
- `src/components/testimonial-row.tsx` (server): `export function TestimonialRow({ t }: { t: Testimonial })` → `<li className="border-b border-dashed border-border py-4">`; header `<p className="flex flex-wrap gap-x-2 gap-y-0.5 text-[13px]">` with `<span className="basis-full text-accent-muted sm:basis-auto">{slug}.md<span className="hidden sm:inline"> ·</span></span>`, `<span className="font-medium text-text-primary">{name}</span>`, `<span className="text-text-secondary">, {role}{company ? ` @ ${company}` : ""}</span>`, and ONLY when `year` exists `<span className="whitespace-nowrap text-text-secondary">· {year}</span>`. Quote: `<p className="mt-2 max-w-[65ch] font-sans text-sm leading-relaxed text-text-primary">{quote}</p>`. When `link`: `<a href={link} target="_blank" rel="noreferrer" aria-label={`open link for ${name}`} className="mt-2 inline-block text-xs text-text-secondary hover:text-accent">./open --link</a>`.
- `src/app/(features)/testimonials/page.tsx` (server): `export const metadata = { title: "testimonials · testuser@sh:~" }` (build the string from `SHELL`); default export renders `<Container className="flex-col overflow-hidden pt-12 md:pt-16 min-h-[calc(100dvh-100px)]">` → `<CommandHeader command="cat testimonials/*.md" subtitle="notes from people i've shipped with — quoted as sent." />` → `<TestimonialsList items={TESTIMONIALS} />`. `TestimonialsList`: when `items.length === 0` → `<p className="mt-8 text-sm text-text-secondary">cat: testimonials/*.md: No such file or directory</p>`; else `<ul className="mt-8 border-t border-dashed border-border">` of `TestimonialRow`s. Rows are not links and do not translate on hover.

Rules: lowercase chrome; every color via tokens (`text-accent`, `border-border`, …); no `neutral-`, no hex, no `rounded-*`; sans only for the quote paragraph. The scaffold's `tests/unit/harness-rules.test.ts` scans your files too.

## Proof before you declare

From `terminal-portfolio/`: `npm ci` if needed; `npx vitest run --reporter=junit --outputFile=reports/unit.xml` green; `npx eslint . -f junit -o reports/lint.xml` exit 0; `npx tsc --noEmit` exit 0; `npm run build` exit 0; then `npm run start -- -p 3000 &` and `BASE_URL=http://localhost:3000 npx playwright test tests/integration --reporter=list` green (paste the summary). Commit only the files you own. Declare with `devos runs declare "<summary: red run → green run counts, check exit codes, anything flagged>"`. Do not ask questions; flag them in the result.
