# Enforcement

A methodology that depends on discipline degrades at exactly the moment discipline is expensive: late, tired, one thing left to ship. A methodology wired into a script that exits non-zero does not.

This directory contains [`lint.mjs`](lint.mjs), which enforces the spec invariants described in [`../METHOD.md`](../METHOD.md) and analyzed in [`../docs/CASE-STUDY-B.md`](../docs/CASE-STUDY-B.md).

---

## Running it

Drop `lint.mjs` into your `specs/` directory and run:

```bash
node specs/lint.mjs
```

No dependencies. No install step. Node 16 or later. The script **never writes anything**, ever, so it is safe to run in any hook, on any branch, in CI, or against a dirty tree. A linter that repairs state is a linter people stop reading.

It expects this layout:

```
specs/
  Completed/          # every file here must declare status: done
  Not Completed/      # every file here must declare status: not-completed
  Parked/             # every file here must declare status: parked
  README.md           # the living index; every spec must appear in it
  backfill-ledger.md  # optional; tracked debt for done specs lacking live acceptance
  lint.mjs
```

Each spec file opens with frontmatter:

```markdown
---
spec: 8
title: JD history archive
status: done
---
```

---

## What it enforces

Eleven checks. Full reasoning for each is in [`../docs/CASE-STUDY-B.md`](../docs/CASE-STUDY-B.md); this is the operator's summary.

| # | Check | Fails when |
|---|---|---|
| 1 | Frontmatter block exists | The file does not open with a `---` fenced block. The file is then skipped for the rest of the per-file checks. |
| 2 | `spec:` present | No `spec:` line in frontmatter. |
| 3 | `title:` present | No `title:` line in frontmatter. |
| 4 | `status:` present | No `status:` line in frontmatter. |
| 5 | `status:` agrees with the folder | The declared status does not match the folder the file sits in. **The folder is the state.** |
| 6 | Spec number matches the filename | Frontmatter says `spec: 8` but the file is not named `08-*.md`. |
| 7 | A `done` spec has live acceptance | `status: done` with no `## Live acceptance` section, and not listed under `## Pending backfill` in `backfill-ledger.md`. |
| 8 | A `done` spec has no open questions | `status: done` while still containing `[NEEDS CLARIFICATION: ...]` tokens. |
| 9 | No stray specs in the root | A file matching `NN-name.md` sits directly in `specs/`, so it has no folder and therefore no state. |
| 10 | The index exists | `specs/README.md` is missing. |
| 11 | Every spec is in the index | A spec's filename appears nowhere in `README.md`. |

The two checks that carry the most weight are 5 and 7. Check 5 makes a spec's state a fact on disk rather than a belief. Check 7 enforces the rule that matters most:

> **A spec is not done when the code is written. It is done when its live acceptance is real.**

---

## What a passing run looks like

```
$ node specs/lint.mjs
specs: 8 (done 8 · not-completed 0 · parked 0)
lint clean
```

Exit code 0. The count line prints on every run, pass or fail, so a clean run still tells you the shape of the project.

## What a failing run looks like

```
$ node specs/lint.mjs
specs: 9 (done 7 · not-completed 2 · parked 0)

3 problem(s):
  ✗ Completed/05-graph-compilation-routing.md: status 'not-completed' disagrees with folder (expected 'done'), move the file or fix the frontmatter
  ✗ Completed/07-resume-curation-page-budget.md: done but still carries 1 [NEEDS CLARIFICATION] token(s)
  ✗ Not Completed/09-new-thing.md: not linked from README.md index
$ echo $?
1
```

Every violation is collected before exiting, so one run tells you everything instead of making you fix and re-run repeatedly.

---

## Wiring it as a pre-commit hook

This catches the human. Create `.git/hooks/pre-commit` and make it executable:

```bash
#!/usr/bin/env bash
set -e
node specs/lint.mjs
```

```bash
chmod +x .git/hooks/pre-commit
```

If you want it shared across the team (git hooks are not committed by default), point git at a tracked directory instead:

```bash
mkdir -p .githooks
# put the script above at .githooks/pre-commit, then:
chmod +x .githooks/pre-commit
git config core.hooksPath .githooks
```

Add the same command to CI so that a `--no-verify` commit still gets caught at the pull request:

```yaml
# .github/workflows/specs.yml
name: specs
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: node specs/lint.mjs
```

---

## Wiring it as an agent Stop hook

This is the part that matters, and it is the whole argument of [`../METHOD.md`](../METHOD.md) made concrete. A pre-commit hook catches a human at commit time. A Stop hook catches the *agent* at the end of every turn, which means the verification loop closes without anyone standing in it.

In `.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node specs/lint.mjs"
          }
        ]
      }
    ]
  }
}
```

A non-zero exit blocks the turn from ending and returns the error output to the agent, which then has a concrete, mechanical problem to fix rather than a vague sense that something might be off. The agent moves the file, or writes the live acceptance section, or answers the open question, and tries again.

Run the test suite from the same hook, so that "green" is enforced rather than asserted:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          { "type": "command", "command": "node specs/lint.mjs" },
          { "type": "command", "command": "npm test" }
        ]
      }
    ]
  }
}
```

Three properties make this qualitatively different from telling the agent to check its work in the prompt:

1. **It is deterministic.** It runs every time, including the run where the agent was confident.
2. **It is not persuadable.** An in-prompt instruction competes with everything else in the context window. An exit code does not.
3. **It produces evidence rather than a claim.** The output is the observed result, which is the same standard the live-acceptance rule applies to specs.

Escalation ladder, weakest to strongest, per [Anthropic's best practices](https://code.claude.com/docs/en/best-practices):

1. In-prompt instruction: "run the tests after implementing and fix any failures."
2. A goal condition: a separate evaluator re-checks after every turn.
3. A Stop hook: the turn cannot end until the check passes.

Get to 3. Until you do, you are the verification loop.

---

## Adapting it

The script is about 100 lines and deliberately readable. Common adaptations:

- **Different folder names.** Edit the `FOLDER_STATUS` map at the top. Keep the mapping one-to-one: three states, three folders, no overlap.
- **A required section other than `## Live acceptance`.** Change the regular expression in the `status === "done"` branch. Resist the urge to require many sections; each one you add is a rule someone will satisfy by pasting a heading.
- **Extra frontmatter keys.** Follow the pattern of the existing `spec` and `title` checks.
- **Enforcing the six-section spec shape.** Straightforward to add, but consider whether it earns its cost. A heading is easy to fake; live acceptance is not. Spend enforcement budget on checks that cannot be satisfied by typing.
