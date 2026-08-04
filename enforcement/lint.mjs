#!/usr/bin/env node
/**
 * specs/lint.mjs: enforces the spec-driven-development invariants.
 *
 *   node specs/lint.mjs
 *
 * Invariants (mirrors the spec-driven-dev skill; see specs/README.md):
 *   1. Exactly three states: done | not-completed | parked. The FOLDER is the state.
 *   2. Frontmatter `status:` must agree with the folder the file sits in.
 *   3. Every spec carries `spec:` and `title:` frontmatter, and its number matches its filename.
 *   4. A `done` spec must have a `## Live acceptance` section, OR be listed under
 *      "Pending backfill" in specs/backfill-ledger.md (tracked debt, not hidden debt).
 *   5. No `[NEEDS CLARIFICATION: ...]` tokens may survive in a `done` spec.
 *   6. Every spec appears exactly once in specs/README.md's index.
 *
 * Exit 0 clean, 1 on any violation. No writes, ever.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const FOLDER_STATUS = { "Completed": "done", "Not Completed": "not-completed", "Parked": "parked" };

const errors = [];
const specs = [];

for (const [folder, expected] of Object.entries(FOLDER_STATUS)) {
  const dir = join(ROOT, folder);
  if (!existsSync(dir)) continue;
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".md")) continue;
    const path = join(dir, name);
    const raw = readFileSync(path, "utf8");
    const rel = `${folder}/${name}`;

    const fm = raw.match(/^---\n([\s\S]*?)\n---\n/);
    if (!fm) { errors.push(`${rel}: missing frontmatter block`); continue; }
    const get = (k) => (fm[1].match(new RegExp(`^${k}:\\s*(.+)$`, "m")) || [])[1]?.trim();

    const status = get("status");
    const num = get("spec");
    const title = get("title");

    if (!num) errors.push(`${rel}: frontmatter missing 'spec:'`);
    if (!title) errors.push(`${rel}: frontmatter missing 'title:'`);
    if (!status) errors.push(`${rel}: frontmatter missing 'status:'`);
    else if (status !== expected) {
      errors.push(`${rel}: status '${status}' disagrees with folder (expected '${expected}'), move the file or fix the frontmatter`);
    }
    if (num && !name.startsWith(String(num).padStart(2, "0") + "-")) {
      errors.push(`${rel}: frontmatter spec '${num}' does not match filename`);
    }

    const body = raw.slice(fm[0].length);
    if (status === "done") {
      const hasLive = /^##\s+Live acceptance/m.test(body);
      const ledger = existsSync(join(ROOT, "backfill-ledger.md"))
        ? readFileSync(join(ROOT, "backfill-ledger.md"), "utf8") : "";
      const pending = ledger.split(/^##\s+Pending backfill/m)[1] || "";
      const inLedger = pending.includes(name) || new RegExp(`\\bspec\\s*0*${num}\\b`, "i").test(pending);
      if (!hasLive && !inLedger) {
        errors.push(`${rel}: done but has no '## Live acceptance' and is not listed under 'Pending backfill' in backfill-ledger.md`);
      }
      const clar = body.match(/\[NEEDS CLARIFICATION:[^\]]*\]/g);
      if (clar) errors.push(`${rel}: done but still carries ${clar.length} [NEEDS CLARIFICATION] token(s)`);
    }

    specs.push({ num, name, rel, status, title });
  }
}

// Stray specs left in the specs/ root (state is the folder, so root means no state)
for (const name of readdirSync(ROOT)) {
  if (/^\d{2}-.+\.md$/.test(name)) {
    errors.push(`${name}: sits in specs/ root, every spec must live in Completed/, Not Completed/, or Parked/`);
  }
}

// README index coverage
const readmePath = join(ROOT, "README.md");
if (!existsSync(readmePath)) {
  errors.push("README.md missing, it is the living index");
} else {
  const readme = readFileSync(readmePath, "utf8");
  for (const s of specs) {
    if (!readme.includes(s.name)) errors.push(`${s.rel}: not linked from README.md index`);
  }
}

const byStatus = (st) => specs.filter((s) => s.status === st).length;
console.log(`specs: ${specs.length} (done ${byStatus("done")} · not-completed ${byStatus("not-completed")} · parked ${byStatus("parked")})`);

if (errors.length) {
  console.error(`\n${errors.length} problem(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log("lint clean");
