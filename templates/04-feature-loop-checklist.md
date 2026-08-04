# The Feature Loop: One-Page Checklist

Pin this. Run it for every non-trivial feature. For one-line fixes, skip to "Implement" and just do it: do not over-process small changes.

## Stage 0: Constitution (once per project)
- [ ] Constitution exists and is lean (always-loaded file around 200 lines or fewer; details live in the architecture doc or in skills).
- [ ] Hard rules, security rules, testing rules, commit rules, naming taboos all present.

## Stage 1: Specify (what and why)
- [ ] `specs/<feature>/spec.md` created.
- [ ] Agent **interviewed me** to surface edge cases I'd have missed.
- [ ] Acceptance criteria written in EARS (`WHEN…SHALL…`), numbered.
- [ ] Out-of-scope listed explicitly.
- [ ] Definition of done = a concrete end-to-end check.

## Stage 2: Plan (how)
- [ ] `plan.md` produced in plan mode / fresh context.
- [ ] Files, interfaces, data/state, edge-case handling all named.
- [ ] Rationale for non-obvious choices captured.
- [ ] **I read and edited the plan before any code.**

## Stage 3: Tasks (steps)
- [ ] `tasks.md`: small, dependency-ordered, each names its files + its test.
- [ ] Independent tasks marked `[P]`.
- [ ] No orphaned code: every task integrates into prior work.

## Stage 4: Implement (red then green)
- [ ] One task at a time; **test written first, confirmed failing, then made to pass.**
- [ ] Agent has a self-runnable check (suite/build/screenshot) and **shows output as evidence.**
- [ ] Hard gate in place (Stop hook or `/goal`) so "green" is enforced, not asserted.
- [ ] `/clear` between unrelated tasks; one feature per session.

## Stage 5: Review and ship
- [ ] Fresh-context reviewer subagent checked the diff vs `spec.md` (correctness/requirement gaps only).
- [ ] Full suite green (evidence shown).
- [ ] Decisions/rationale logged in `DECISIONS.md`.
- [ ] Spec marked `Implemented`; progress updated; commit + PR with descriptive message.

## Anti-patterns to catch yourself doing
- [ ] Kitchen-sink session, meaning unrelated tasks piling into one context. Clear the context.
- [ ] Correcting the same thing three times. Clear the context and restart with a better prompt.
- [ ] Bloated always-loaded constitution. Prune it or move content to skills.
- [ ] Trusting "looks done" without a check. Never ship what you cannot verify.
- [ ] Editing a global mega-doc forever. Archive specs per feature to avoid drift.
