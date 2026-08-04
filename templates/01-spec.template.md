# Spec: `<feature-name>`

> Stage 1 of the feature loop: the **what** and **why**. No tech decisions here.
> File location: `specs/<feature-name>/spec.md`
> Best way to fill this in: have the agent **interview you** (see prompt at bottom).

**Status:** Draft | Approved | Implemented | Archived
**Owner:** <you>
**Created / Last updated:** <date>

## 1. Problem & goal
- What problem does this solve, for whom?
- Why now? What does success look like in one sentence?

## 2. User stories
- As a `<role>`, I want `<capability>`, so that `<benefit>`.

## 3. Acceptance criteria (EARS format, each becomes a test)
> Use `WHEN <trigger>, the system SHALL <response>`. Number them; each maps 1:1 to a named test.

- **AC-1:** WHEN `<trigger>`, the system SHALL `<observable behavior>`.
- **AC-2:** WHEN `<trigger>`, the system SHALL `<behavior>` AND SHALL NOT `<forbidden behavior>`.
- **AC-3:** WHILE `<state>`, WHEN `<trigger>`, the system SHALL `<behavior>`.

## 4. Out of scope (explicit)
- What this feature deliberately does NOT do (prevents scope creep / over-engineering).

## 5. Edge cases & failure modes
- Empty/zero state, malformed input, network failure, duplicates, permissions, etc.
- For each, the expected behavior (these often become extra ACs).

## 6. Definition of done (end-to-end verification)
- The single end-to-end check that proves the feature works (the thing a reviewer runs).
- "All ACs have passing tests; full suite green; reviewed in fresh context."

---
### Agent prompt to generate this spec
```
I want to build <one-line description>. Interview me in detail using the
AskUserQuestion tool. Ask about behavior, UI/UX, edge cases, failure modes,
and tradeoffs. Dig into the hard parts I might not have considered. Don't ask
obvious questions. Keep interviewing until we've covered everything, then write
a complete spec to specs/<feature-name>/spec.md using the template, with
acceptance criteria in EARS (WHEN…SHALL…) format.
```
