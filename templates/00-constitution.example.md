# Project Constitution: `<PROJECT NAME>`

> The durable rules that apply to **every** feature. Written once, changed rarely.
> This is the "constitution" layer of spec-driven development. In practice the role is
> often split across `CLAUDE.md` or `AGENTS.md` (always loaded) plus an `ARCHITECTURE.md`
> (loaded on demand). Keep the always-loaded part short and put longer reference
> material in the architecture file or in skills.

## 1. Identity
- What this product is, who it is for, commercial status.
- Naming taboos: brands or terms that must never appear in shipped code, UI, or commits.
  If a restriction is contractual, say so, and turn it into a test (see the worked example).

## 2. Hard constraints (non-negotiable)
- Stack constraints, for example "vanilla JS, no frameworks."
- Architecture boundaries, for example "all secrets only in serverless functions."
- "Smallest safe change only. Do not refactor unrelated code."
- "Read before writing."

## 3. Security rules
- Which keys may appear client-side, and which never may.
- Input sanitization and output-encoding expectations.

## 4. Testing rules
- Every task ships with tests; a step is not done until they pass.
- Test runner and file-naming conventions.
- The suite must be **green and shown as evidence** before a step is marked done.

## 5. Commit and tracking rules
- Conventional commit prefixes.
- After each step: update the decision log and the progress record.

## 6. Quality bar (the project-wide definition of done)
- No console errors, no orphaned or dead code, no secrets in the diff.
- Out-of-scope changes are a defect, not a bonus.

---
### How to use
- Keep the always-loaded file lean. For each line ask: *"would removing this cause the
  agent to make a mistake?"* If not, cut it or move it into a skill.
- Put "sometimes relevant" knowledge in `.claude/skills/` so it loads on demand.
