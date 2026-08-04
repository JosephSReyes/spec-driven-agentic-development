# Templates

Copy-paste artifacts for every stage of the loop described in [`../METHOD.md`](../METHOD.md). Everything here is generic. Nothing carries project-specific content.

## The index

| File | Stage | What it is |
|---|---|---|
| [`00-constitution.example.md`](00-constitution.example.md) | **Stage 0**, once per project | The durable rules that apply to every feature: identity, naming taboos, hard stack constraints, security boundaries, testing rules, commit conventions, and the project-wide definition of done. |
| [`CLAUDE.md.example`](CLAUDE.md.example) | **Stage 0**, once per project | The lean, always-loaded companion to the constitution. Only rules that change agent behavior. Everything occasional is referenced by path instead of inlined. |
| [`01-spec.template.md`](01-spec.template.md) | **Stage 1**, per feature | The what and the why. User stories, EARS acceptance criteria, explicit out-of-scope, edge cases, definition of done. No technology decisions. Includes the "interview me" prompt that fills it in. |
| [`02-plan.template.md`](02-plan.template.md) | **Stage 2**, per feature | The how. Files touched, interfaces and exact signatures, data and state changes, edge-case handling, and rationale for every non-obvious choice. The human edits this before any code exists. |
| [`03-tasks.template.md`](03-tasks.template.md) | **Stage 3**, per feature | Small, dependency-ordered steps. Each task names the criteria it implements, the files it touches, and the test that proves it. Includes the per-task red-then-green implementation prompt. |
| [`04-feature-loop-checklist.md`](04-feature-loop-checklist.md) | **Stages 0 through 5** | One page, pinnable. Every gate in the loop as a checkbox, plus the anti-patterns to catch yourself doing. Use it as the running audit rather than as a document you fill in. |
| [`WORKED-EXAMPLE.md`](WORKED-EXAMPLE.md) | Reference | One invented feature carried through spec and tasks, showing how prose requirements become numbered `WHEN ... SHALL ...` lines and how each line becomes exactly one test. Read this if the other templates feel abstract. |

## The order to use them

**Once, when the project starts:**

1. `00-constitution.example.md` into your repo root or docs folder. Fill it in.
2. `CLAUDE.md.example` into `CLAUDE.md`. Keep it short. For each line, ask whether removing it would cause a mistake.

**Then, for every non-trivial feature:**

3. Create `specs/<feature-name>/`.
4. `01-spec.template.md` into `spec.md`. Fill it in by having the agent interview you, using the prompt at the bottom of the template. Write the acceptance criteria in EARS format.
5. `02-plan.template.md` into `plan.md`. Produce it in plan mode or a fresh context, then **read and edit it yourself before any code is written**. This is the cheapest intervention point in the whole method.
6. `03-tasks.template.md` into `tasks.md`. Each task names its files and its test.
7. Implement task by task, test first, using the prompt at the bottom of the tasks template.
8. Run `04-feature-loop-checklist.md` as the pre-ship audit.

**Skip all of this** when the change fits in one sentence. Ceremony applied to a typo fix teaches the team to route around the process.

## Reading order if you are new to this

`WORKED-EXAMPLE.md`, then `04-feature-loop-checklist.md`, then [`../METHOD.md`](../METHOD.md) for the reasoning behind each gate. The templates themselves make more sense once you have seen one feature go through them.
