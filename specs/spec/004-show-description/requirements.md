# Requirements: 004-show-description

**Branch**: `spec/004-show-description` | **Repository**: `terminal-portfolio` | **Rigor**: light | **Design**: optional
**Status**: needs input (see open questions)

## Sources

- **S1 — Request (inline prompt, sha256 `d6d7305e…`)**: "Read harness". This is the only text the pipeline bound. It names no feature behavior.
- **S2 — Harness**: `terminal-portfolio/AGENTS.md` (commit `32190a9`, "harness v1.1"). Design source of truth for the portfolio. Cited below as `AGENTS.md:<lines>`.
- **S3 — Branch name**: `spec/004-show-description` suggests the feature is to show a project or item description. This is an inference, not a stated requirement (see A1).

## Derived requirements

### REQ-001 — Harness is the governing design source
The plan and all later stages must treat `AGENTS.md` as the design source of truth, including its non-negotiable rules and consistency invariants.
- Source: S1 ("Read harness"), S2 `AGENTS.md:1-7`, `AGENTS.md:19-49`, `AGENTS.md:304-314`.
- **AC-001.1**: `plan.md` cites every harness section it relies on by line range.
- **AC-001.2**: No plan decision contradicts a non-negotiable rule (rules 1–10 at `AGENTS.md:19-49`). Checked by review of `plan.md` against the rules. Automated proof does not exist yet because no code or lint config exists (see REQ-004).

### REQ-002 — Description display (scope UNRESOLVED)
The feature shows a description somewhere in the portfolio. Which surface, and what text, is not decided.
- Source: S3 (inference). Blocked by Q1 and Q2.
- Candidate surfaces, all already described in the harness:
  - Project rows on home and `/projects`, where "description sans" is specified (`AGENTS.md:202-211`).
  - Project detail window chrome (`AGENTS.md:213-218`).
  - The interactive shell's `ls -l` output (`AGENTS.md:274-291`).
- Candidate data: the `description` field on project data (`AGENTS.md:143`). Its existence is documented, but no data file exists in the repo.
- **AC-002.1 (pending Q1)**: Once the surface is chosen, the description renders in that surface using sans type (`AGENTS.md:29`) and token colors only (`AGENTS.md:39-41`).
- **AC-002.2 (pending Q1)**: Projects with no description render no dangling separator or empty block. This matches the year-omission rule at `AGENTS.md:205-206`.

### REQ-003 — Presentation follows the harness
Any new description UI follows the list-row and typography patterns already in the harness, and adds no new tokens or ornaments.
- Source: S2 `AGENTS.md:202-211`, `AGENTS.md:29`, `AGENTS.md:31-37`, `AGENTS.md:39-41`.
- **AC-003.1**: No `rounded-*` (except status dots), no hex colors in components, no new decorative images. Checked by a lint or grep rule once tooling exists (REQ-004). Until then this is review-only.

### REQ-004 — Reproducible checks (blocking for implementation)
The repository must be able to run the checks the harness names: `npx tsc --noEmit`, `npm run build` (`AGENTS.md:313`), plus lint, unit, integration and e2e as declared by the factory gates.
- Source: S2 `AGENTS.md:313`; factory gates (`devos gates`), which report unit, lint, integration and e2e as required and unavailable for `terminal-portfolio`.
- Current state: the repository has no `package.json`, no source tree, no `devos.env.yaml` and no test runner. The README says the reference implementation is "coming".
- **AC-004.1 (pending Q2)**: A scaffold exists with declared scripts, and each required check has a recipe published before first execution.

## Assumptions

- **A1**: "Show description" means displaying the existing project `description` field. Basis: S3 and `AGENTS.md:143`. Not confirmed.
- **A2**: The factory's "Read harness" request means the feature is to be built into this harness's design. It does not mean a documentation-only pass.
- **A3**: No new runtime dependency is needed for a description display.

## Open questions

- **Q1 (blocking)** — Which surface should show the description: project rows on home, the `/projects` list, the project detail page, the shell's `ls -l` output, or several? Should the text be the existing `description` field, or a new field?
- **Q2 (blocking)** — There is no application code in `terminal-portfolio`. Should this feature (a) scaffold the Next.js reference implementation the harness describes (`AGENTS.md:318-341`), or (b) assume a separate app already exists and target it, in which case which repository?
- **Q3 (non-blocking, deferred to design)** — Does the chosen surface need a visual design pass? Current recommendation: no, because the harness already specifies the row pattern (see `research.md`).
- **Q4 (blocking)** — The hub has no constitution at `.hub/.specify/memory/constitution.md` (only `.specify/templates/`). Does a constitution exist elsewhere, or should the constitution check be recorded as absent for this feature? Until answered, the constitution gate is N/A, not PASS.
