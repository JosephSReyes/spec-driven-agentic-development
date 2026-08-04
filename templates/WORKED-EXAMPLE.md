# Worked Example: one feature through the whole loop

> **Note on provenance.** This example is adapted from real project work, with all identifying detail removed. The feature described here is invented: a generic "activity log import" for a fictional volunteer-shift tracking app. The *shape* is what is real, the acceptance-criteria style, the decomposition into tasks, the way each criterion maps to exactly one test, and the way constraints (including a contractual naming restriction) become testable lines rather than good intentions. Nothing here reflects any actual product's behavior.

The point of a worked example is to show the mechanical part: how a prose idea becomes numbered `WHEN ... SHALL ...` lines, and how those lines become a task list where "is it done?" has a yes-or-no answer.

Folder: `specs/activity-log-import/`

---

## `spec.md` (excerpt)

**Status:** Implemented · **Owner:** <name> · **Created:** <date>

### 1. Problem and goal

Coordinators currently re-key each volunteer's hours by hand from an exported log file. Success: a coordinator uploads one or more exported log files and sees correct historical hours for the volunteers already on their own roster, with no manual entry.

### 2. User stories

- As a coordinator, I want to upload exported activity logs so that my volunteers' past shifts appear without my typing them in one at a time.

### 3. Acceptance criteria (EARS, each becomes exactly one test)

- **AC-1:** WHEN the roster has 0 volunteers, the system SHALL disable the IMPORT LOG control.
- **AC-2:** WHEN the roster has 1 or more volunteers, the system SHALL enable the IMPORT LOG control.
- **AC-3:** WHEN an imported entry's volunteer name matches a roster volunteer, the system SHALL append the entry to that volunteer's existing history array with `source: "import"`.
- **AC-4:** WHEN an imported entry's volunteer name does not confidently match a roster volunteer, the system SHALL discard the entry AND SHALL NOT create a new volunteer AND SHALL NOT count it in the import summary.
- **AC-5:** WHEN an entry is a completed shift, the system SHALL record it as billable hours; WHEN it is a cancellation or a no-show, the system SHALL record a zero-hour entry with a reason code and no hours total.
- **AC-6:** WHEN an entry falls inside posted opening hours, the system SHALL categorize it as `scheduled`; WHEN it falls outside them, the system SHALL categorize it as `ad-hoc`.
- **AC-7:** WHEN two uploaded files overlap in date range, the system SHALL de-duplicate the overlapping entries.
- **AC-8:** WHEN a single upload spans multiple dates, the system SHALL tag each entry with the date from its section header rather than the upload date.
- **AC-9:** The system SHALL NOT include the restricted third-party product name anywhere in shipped code, comments, UI text, or commit messages. *(The project operates under a contractual naming restriction; see the constitution.)*

### 4. Out of scope (v1, load-bearing)

- No review or reassignment UI. An entry is either matched or discarded; there is no "unknown volunteer" concept of any kind, and adding one is a scope violation rather than a helpful extra.
- No editing of imported entries after import.
- No aggregate reporting rebuild. Summary views derive from per-volunteer data and update automatically.

### 5. Edge cases

| Case | Expected behavior |
|---|---|
| Empty file uploaded | Import summary reports 0 entries; no error dialog. |
| File with no recognizable header | Reject the file with a named error; import nothing. |
| Same file uploaded twice | Second upload adds nothing (AC-7 covers it). |
| Name matches two roster volunteers | Not a confident match, so AC-4 applies: discard. |

### 6. Definition of done

Every AC has a passing named test; the full suite is green with output shown as evidence; the diff has been reviewed in a fresh context against this spec; the restricted name appears nowhere in the diff.

---

## `tasks.md` (excerpt)

- [x] **T1 - Import control gating** · Implements AC-1, AC-2 · Files: `index.html`, `js/activity-import.js` · Test: `tests/unit/activity-import.test.js`, empty roster disabled and enabled after first volunteer added.
- [x] **T2 - Parser and roster-scoped filtering** · Implements AC-3, AC-4 (match side) · Files: `functions/parse-activity-log.js` · Test: integration, structured parse output plus roster filter.
- [x] **T3 - Entry type mapping** · Implements AC-5 · Test: unit, completed maps to hours, cancellation maps to zero-hour with reason code.
- [x] **T4 - Scheduled vs ad-hoc categorization** · Implements AC-6 · Test: unit, boundary cases at exactly the opening and closing time.
- [x] **T5 - De-duplication across overlapping uploads** · Implements AC-7 · Test: unit, two overlapping files collapse to one entry set.
- [x] **T6 - Discard unmatched, never create a volunteer** · Implements AC-4 (discard side) · Test: unit, ambiguous name discarded and roster length unchanged.
- [x] **T7 - Date tagging from section headers** · Implements AC-8 · Test: unit, multi-date upload tags per header.
- [x] **T8 - Restricted-name guard** `[P]` · Implements AC-9 · Test: unit, scans source and diff for the forbidden string and fails on any hit.
- [x] **T-final - Full regression and fresh-context review** · Full suite green, output shown; reviewer subagent run against `spec.md` with scope limited to correctness.

Note T8. A contractual constraint that lives only in a rules document is a constraint someone will violate in month four. The same constraint expressed as a test that greps the source is one nobody can violate without the build going red. Wherever a rule *can* be turned into a check, turning it into a check strictly dominates writing it down.

---

## What this example is demonstrating

1. **Every AC is one test.** "Is the feature done?" is answered by the test runner, not by reading the diff and forming an impression.
2. **The out-of-scope list is written to be enforceable.** "No unknown-volunteer concept of any kind" is a sentence a reviewer can act on. "Keep it simple" is not.
3. **Constraints become tests wherever possible.** AC-9 is a legal and contractual requirement, and it is checked by a script.
4. **The spec lives in its own folder and is archived when done.** It is never edited again, so it cannot drift out of agreement with the code. Later changes get their own spec.
