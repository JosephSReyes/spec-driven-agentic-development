# Tasks: `<feature-name>`

> Stage 3 of the feature loop: small, dependency-ordered, **individually testable** steps.
> File location: `specs/<feature-name>/tasks.md`
> Rule (Harper Reed): no orphaned code. Every task integrates into the previous work.
> Mark independent tasks `[P]` (can run in parallel). Each task names its files AND its test.

**Spec:** `spec.md` · **Plan:** `plan.md`

## Task list

- [ ] **T1: <title>**
  - Implements: AC-1
  - Files: `path/...`
  - Test (write first, must fail then pass): `tests/.../t1.test.js`, asserts AC-1
  - Done when: test green + no regressions.

- [ ] **T2: <title>**  *(depends on T1)*
  - Implements: AC-2, AC-3
  - Files: `path/...`
  - Test: `tests/.../t2.test.js`
  - Done when: tests green.

- [ ] **T3: <title>** `[P]`  *(independent of T1/T2)*
  - Implements: AC-4
  - Files: `path/...`
  - Test: `tests/.../t3.test.js`

- [ ] **T-final: full regression and review**
  - Run full suite (show output as evidence).
  - Fresh-context reviewer subagent vs `spec.md`.
  - Log decisions in `DECISIONS.md`; mark spec `Implemented`.

---
### Per-task implementation prompt (TDD, red then green)
```
Implement task T<n> from specs/<feature-name>/tasks.md.
1. Write the test first from the acceptance criterion; run it and confirm it fails.
2. Implement the smallest change that makes it pass.
3. Run the test (and the affected suite); show the output.
4. Do not touch anything outside this task's listed files.
Stop and report when the test is green.
```
