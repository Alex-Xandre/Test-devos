# Implementation Plan: 004-show-description

**Branch**: `spec/004-show-description` | **Repository**: `terminal-portfolio` | **Base**: `main`
**Requirements**: `requirements.md` | **Research**: `research.md` | **Tasks**: `task-plan.json`
**Status**: needs input. Blocking questions Q1 and Q2 must be answered before implementation.

## Summary

The request is "Read harness". Read as an instruction, it asks for the portfolio harness (`AGENTS.md`) to govern this feature. Read with the branch name, the feature shows a project description. The repository has no application code, so there is no existing surface to modify. The plan cannot yet choose a surface, an architecture, or a check runner. It records the governing rules and the two decisions a person must make.

## Governing rules

- Harness: `terminal-portfolio/AGENTS.md`, rules 1–10 (`AGENTS.md:19-49`) and consistency invariants (`AGENTS.md:304-314`).
- Constitution: no real constitution document is present under `.hub/.specify/memory/`. The plan's constitution check is therefore recorded as **N/A — document absent**, not PASS. This must be resolved before ready.
- ADRs: none exist in the hub. No ADR is proposed; the decisions here are not significant enough to warrant one until Q2 is answered.

## Technical Context

- **Language/Framework**: TypeScript, Next.js App Router, Tailwind v4 (`AGENTS.md:11`). Not yet scaffolded.
- **Styling**: token-only CSS (`AGENTS.md:51-75`). IBM Plex Mono and Sans via `next/font` (`AGENTS.md:80-81`).
- **Data**: project data in `src/app/(features)/projects/project-data.ts` (`AGENTS.md:142-143`). The file does not exist yet.
- **Testing**: none declared. The factory gates require unit, lint, integration and e2e.
- **Target**: static-first web app; `preview` required by the validate gate.
- **Dependencies**: none new expected (A3).

## Interfaces

Pending Q1 and Q2. Two candidate shapes:

- **If Q1 = project rows on home or `/projects`**: a `ProjectRow` component renders `description` in `font-sans`, with `year` omitted when absent. Props: `project: Project`. No new network or state.
- **If Q1 = shell `ls -l`**: `shell-commands.ts` gains a pure function returning `lines` that include each project's description (`AGENTS.md:274-291`). The panel is unchanged.

The `Project` type is the existing `description: string` field (`AGENTS.md:143`). The plan does not add a field (see research, alternative 3).

## State transitions and error handling

None. The feature is read-only rendering. Empty or missing description is handled by omission, not placeholder text (`AGENTS.md:205-206`).

## Migration, deployment and rollback

Not applicable until a scaffold exists. Rollback is removing the description rendering, which does not affect data.

## Dependency order and ownership

1. Answer Q1 and Q2 (human decision).
2. If Q2 = scaffold: scaffold the Next.js app with scripts and checks (implementation owner).
3. Write failing tests for the chosen surface (test-first, implementation owner, since no separate test author is supplied).
4. Implement rendering.
5. Publish check recipes with `recipe publish` before the first check run.

Ownership boundary: only `terminal-portfolio`. The hub holds specs only. No merge order is needed for a single repository.

## Acceptance-to-test matrix

| Req/AC | Boundary | Setup | Observable assertion | Environment |
|---|---|---|---|---|
| AC-001.1 | Document | `plan.md` | Each cited harness range exists in `AGENTS.md` | Review (no runner) |
| AC-001.2 | Document | `plan.md` vs rules 1–10 | No rule contradicted | Review (no runner) |
| AC-002.1 | Unit | Project with description | Component output contains description in sans class, no hex colors | Unit runner (TBD, Q2) |
| AC-002.1 | Integration | Real project data file | Projects page lists the description text | Integration, `preview` (TBD) |
| AC-002.2 | Unit | Project without description | No empty description element or dangling separator | Unit runner (TBD) |
| AC-003.1 | Static | Source tree | No `rounded-*` outside dots, no hex in components | Lint rule (TBD) |
| AC-004.1 | Static | Scaffold | `tsc --noEmit` and `build` succeed | `npx tsc --noEmit`, `npm run build` (after scaffold) |

Automated proof is planned for every criterion that can be automated. Review-only items are labeled as review. None is assigned to a person.

## Planned check contracts

No runner, command, cwd or preview target can be concretely planned yet. Each check needs its command, runner and acceptance IDs once Q2 is decided. Owners:

- The implementation owner publishes recipes for unit, lint, typecheck, build, integration and e2e before first execution (`recipe publish`).
- `target: http` is required for integration and e2e checks against the rendered pages. A browser is needed for e2e. Neither is declared yet.
- Fresh-state data isolation does not apply: this feature creates no records and has no empty-state criterion.

## Risks

- **R1**: "Read harness" may not be the intended feature. Mitigation: Q1 and Q2 block implementation.
- **R2**: No constitution document exists, so the constitution gate cannot pass. Mitigation: the person supplies it or confirms its absence.
- **R3**: Checks are unavailable until a scaffold exists, so AC-002 and AC-003 are review-only until then.

## Human decisions needed (exact)

1. **Q1**: Which surface shows the description (project rows on home, `/projects` list, detail page, shell `ls -l`, or several), and does it use the existing `description` field?
2. **Q2**: Should this feature scaffold the Next.js reference implementation in `terminal-portfolio`, or target an existing app in another repository?
3. **Q4**: Does a factory constitution exist (none is present at `.hub/.specify/memory/constitution.md`), or should the constitution check be recorded as absent?

## Design routing

`design: optional` → **implement**, recorded for review. The default row pattern is fully specified by the harness (`AGENTS.md:202-211`), so no visual design pass is needed. Revisit if Q1 selects a new layout.
