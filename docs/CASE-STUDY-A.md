# Case Study A: a mature hand-rolled doc set

**Subject:** a production sports-analytics web application, built commercially for a paying client by a single developer working with a coding agent.

**Finding:** the project independently arrived at roughly 80% of spec-driven development without having encountered the term. It was not vibe coding. It was hand-rolled SDD, with one artifact (the decision log) that is *better* than what most teams using formal SDD tooling produce, and four gaps that are refinements rather than rewrites.

**Overall grade: B+ / A-.**

This case study exists because "adopt spec-driven development" is easy advice and hard to act on. Seeing what a strong instinctive version looks like, and precisely where instinct stops being enough, is more useful than a maturity model. All identifying detail about the client, the product, and the developer has been removed. Grades and reasoning are unchanged.

---

## What was actually built

The project governed its agent with seven markdown documents, evolved over months without reference to any published methodology:

- `CLAUDE.md` / `AGENTS.md`: agent rules, identity, hard constraints, commit and test rules
- `ARCHITECTURE.md`: module responsibilities, "what must never change," durable UI conventions
- `PLAYBOOK.md`: thirteen sequential build steps, each with a prompt, a checklist, required tests, and a commit message
- `PROGRESS.md`: a per-step completion log with detailed notes
- `DECISIONS.md`: numbered decisions, each with a reason and a date
- `TESTING.md`: test tooling, conventions, and test-count milestones
- one per-feature spec, written ad hoc for the single most complex feature in the product

Read that list against the artifact chain in [`../METHOD.md`](../METHOD.md) and the correspondence is close to exact. Nobody told this developer to build a constitution, a design doc, a plan, a task tracker, an ADR log, and an eval layer. The problem shape forced it.

---

## Scorecard

Each document graded against the industry artifact it maps to.

| Document | Role it plays | Maps to | Grade | Verdict |
|---|---|---|---|---|
| `CLAUDE.md` / `AGENTS.md` | Agent rules, identity, hard constraints, commit and test rules | **Constitution** (Spec Kit), `CLAUDE.md` (Anthropic) | A- | Strong and well scoped. Slightly long. Some of its content is architecture, not rules, and architecture does not need to be loaded every turn. |
| `ARCHITECTURE.md` | Module responsibilities, "what must never change," UI conventions | **Design** (Kiro `design.md`) | A | Excellent. The section listing UI conventions worth preserving is exactly the durable context an agent needs and almost nobody writes down. |
| `PLAYBOOK.md` | Thirteen sequential steps, each with prompt, checklist, required tests, commit | **Plan + Tasks** (Spec Kit `plan.md` and `tasks.md`) | B | Excellent content, wrong container. It is monolithic: one growing file holding every step ever taken. |
| `PROGRESS.md` | Per-step completion log with detailed notes | **Task tracking** (Kiro task status, Harper Reed's `todo.md`) | B- | Genuinely valuable history, but 45 KB and growing, loaded every session. A drift and maintenance liability. |
| `DECISIONS.md` | Numbered decisions with reason and date | **ADRs**, the artifact SDD teams forget | A | **Best in class. Keep exactly as is.** Directly mitigates the number one documented long-term failure of SDD. |
| `TESTING.md` | Test tooling, conventions, count milestones | **Eval / verification layer** | B+ | Good discipline, not yet gated or automated. A subset of the suite cannot run in the agent's sandbox, which is a hole in the confidence the rest of the suite provides. |
| Per-feature spec (one, ad hoc) | Full spec for the product's hardest feature | **Per-feature spec** (`spec.md`) | A- | This is the developer reaching for modular specs unprompted. The problem is that it was the exception rather than the default. |

---

## What was genuinely strong

**1. Clear separation of concerns across documents.** Rules, architecture, plan, decisions, and tests each live in their own file. This is exactly how the industry now splits a constitution from a spec from a plan. The common failure is cramming all five into one `CLAUDE.md`, which then gets half-ignored because it is too long to attend to.

**2. A decision log with reasons and dates.** The research repeatedly identifies missing rationale as the thing that makes specs rot. This project recorded *why*, not just *what*, including the reasoning behind non-obvious behavioral choices that a future reader would otherwise have assumed were accidents and "fixed." This is the single most underrated artifact in the repository and the one most teams skip entirely.

**3. Every step shipped with required tests, a commit message, and a verification checklist.** Not aspirational: written into the playbook per step, so skipping it was visible.

**4. Explicit out-of-scope lists and taboos.** The documents named things the agent must never do: entire feature areas that were deliberately excluded, a contractual naming restriction on a term that must not appear in shipped code, "no frameworks," "smallest safe change." Bounding an agent is as important as directing it, and out-of-scope lists are load-bearing precisely because a helpful model will otherwise expand into the gap.

**5. A startup ritual: "read these files before doing any work."** Deliberate context loading rather than hoping the agent finds the right file. The refinement below concerns keeping that load lean, not abandoning it.

---

## The five upgrades, in priority order

### 1. Modularize specs per feature (highest leverage)

**Problem.** `PLAYBOOK.md` is one growing file holding all thirteen steps, and `PROGRESS.md` mirrors it. New work wedges in as "Step 13," then "Maintenance," then "Maintenance 2." This is the monolith that produces documentation drift: the file is never finished, so it is edited forever, and every edit is an opportunity for it to diverge from the code.

**Fix.** Adopt `specs/<feature>/{spec,plan,tasks}.md` for everything new. Each feature is self-contained and archived when done. The playbook and progress log become *history*, not the live working surface.

**Why it works.** A finished, archived, per-feature spec cannot drift, because nobody edits it. This is the structural version of the mitigation, as opposed to the discipline version, which fails eventually.

### 2. Write acceptance criteria in EARS format

**Problem.** Criteria are written as prose ("the import control stays disabled until at least one record exists"). Tests are written separately. The mapping between requirement and test exists only in the developer's head, which means it is invisible to the agent and unverifiable by anyone else.

**Fix.** Write each criterion as `WHEN <trigger>, the system SHALL <response>` and number them. Each numbered criterion becomes exactly one named test.

Illustratively, a rule already recorded in this project's decision log as prose becomes:

```
AC-1: WHEN the roster is empty, the system SHALL disable the import control.
AC-2: WHEN an imported record does not match an existing entity, the system SHALL
      discard the record AND SHALL NOT create an entity.
AC-3: WHEN two uploaded sources overlap, the system SHALL de-duplicate the overlap.
```

**Why it works.** This is the literal bridge between a prose spec and a measurable test suite that maps to requirements. The rules already existed in the decision log. They just were not written in a form a test runner could be pointed at.

### 3. Close the verification loop

**Problem.** Tests exist and are good, but a human runs them. Worse, a portion of the end-to-end suite cannot execute in the agent's sandbox at all, because it depends on a hosted auth provider's script being reachable. So a chunk of the suite silently does not run during agent sessions, and "green" quietly means "the subset that ran, ran."

**Fix.**
- Add a **Stop hook** that runs the suite and blocks the turn from ending until it passes. Deterministic, every time, no exceptions.
- Or set a **goal condition** so a separate evaluator re-checks after each turn.
- Require the agent to **show test output as evidence**, not to assert success.
- Decouple the end-to-end tests from the live third-party dependency: mock the auth provider, or extend the existing pattern that forces protected screens into an active state without network access, so that green actually means green.

**Why it works.** Anthropic's framing is the whole argument: give the agent a check it can run and the loop closes on its own. In the current setup the loop closes on the developer, which means it does not close when the developer is asleep.

### 4. Add a fresh-context reviewer pass before shipping

**Problem.** The agent that implemented the change grades its own work, carrying every justification it invented while writing it.

**Fix.** Before marking a step done, run a reviewer subagent that sees only the diff and the spec:

> *"Review the diff against specs/<feature>/spec.md. Confirm every acceptance criterion is implemented and tested, and that nothing outside scope changed. Report only correctness or requirement gaps."*

**Why it works.** A model that did not write the code is not biased toward it. The final clause is not optional: a reviewer asked for gaps in the abstract will invent them, and the result is defensive code for impossible inputs presented as diligence.

### 5. Tame the progress log and keep the constitution lean

**Problem.** The progress log is 45 KB and loaded every session. The always-loaded agent rules file carries architecture detail that is only occasionally relevant.

**Fix.**
- Progress log: keep a thin top section with current state and the last three steps. Move completed step detail into each feature's spec folder. Deep history is currently being paid for in context tokens on every single session.
- Constitution: keep only rules that change agent behavior. For each line, ask whether removing it would cause a mistake. Move "sometimes relevant" knowledge (long explanations of one subsystem's geometry, for example) into a skill or the architecture document, neither of which is loaded every turn.

**Why it works.** Performance degrades as context fills, and a bloated always-on file gets half-attended-to rather than fully ignored, which is worse because the failure is silent.

---

## Minor notes

- The two agent-rules files (one per agent vendor) are near-duplicates and have already begun to drift: their file-load-order lists differ, and one omits the per-feature spec entirely. Either make one canonical and import it from the other, or add a hook that keeps them in sync. Two sources of truth is zero sources of truth.
- The "Required Tests" line attached to each playbook step is the strongest single habit in the repository. Promote that exact discipline into every new `tasks.md`: every task names its test.
- The project's own progress log records dead artifacts left behind by removed features: an orphaned module nothing imports, CSS for a modal that no longer exists. That is precisely the "no orphaned code" smell Harper Reed warns about. A cleanup task in each feature folder keeps it from accumulating.

---

## The transferable lesson

The gap between this project and formal spec-driven development was not knowledge of the methodology. Every artifact was already there in some form. The gap was **enforcement**: nothing in the repository could tell you, mechanically, whether a spec was honest about its own state, whether every criterion had a test, or whether the suite that reported green had actually run in full.

Instinct produces the artifacts. Only code produces the guarantee. That is what [`CASE-STUDY-B.md`](CASE-STUDY-B.md) is about.
