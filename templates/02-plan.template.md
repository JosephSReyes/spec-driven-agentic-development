# Plan: `<feature-name>`

> Stage 2 of the feature loop: the **how**. Produced in plan mode / fresh context.
> File location: `specs/<feature-name>/plan.md`
> **You (the human) review and edit this BEFORE any code is written.** Cheapest intervention point.

**Spec:** `specs/<feature-name>/spec.md`
**Status:** Draft | Approved

## 1. Approach summary
- Two to four sentences: how we will build it, at a high level.

## 2. Files touched
| File | New/Modified | What changes |
|------|--------------|--------------|
| `path/to/file` | Modified | … |
| `path/to/new` | New | … |

## 3. Interfaces / contracts
- New/changed function signatures, API request/response shapes, data model fields.
- For agents: be concrete. Exact names, exact JSON keys.

## 4. Data & state
- New persisted fields, storage location, migration/back-compat notes.
- Load/initialization order if relevant.

## 5. Edge-case handling (maps to spec §5)
- For each edge case in the spec, the concrete handling strategy.

## 6. Rationale for non-obvious choices (copy into DECISIONS.md on ship)
- Why this approach over the obvious alternative. What tradeoff we accepted.
- (This is what prevents "missing rationale", the number one thing specs rot from.)

## 7. Risks
- What could go wrong; what we'll verify especially carefully.

---
### Agent prompt
```
Read specs/<feature-name>/spec.md and the constitution/architecture docs.
In plan mode, produce specs/<feature-name>/plan.md using this template:
files touched, interfaces, data/state, edge-case handling, and rationale for
any non-obvious choice. Do not write code yet. Flag anything in the spec that
is ambiguous before planning around it.
```
