---
name: dep-bc-repair
description: Agent-led, two-stage repair of JavaScript dependency breaking changes (the DepRepair/CompVuln workflow). Use when upgrading an npm library across a major version and adapting downstream client code, or for any task that needs (1) extracting and refining a library's breaking changes and (2) locating and repairing affected client usages. Stage 1 mines upstream changes and emits TAPIR detection patterns; stage 2 runs TAPIR to locate affected code and applies fixes. The agent itself is the reasoning model — there are no LLM API calls; only deterministic scripts (pattern transform, TAPIR locate, tree-sitter context) are bundled.
---

# Dependency Breaking-Change Repair

## Overview
Upgrade a JavaScript library across a breaking major version and adapt the code
that depends on it. Two mandatory stages:

1. **Upstream change mining** — read the library's docs/commits/tests, author a
   structured breaking-change (BC) list, and convert it into **TAPIR detection
   patterns** (`tapir.json`, refined to `tapirN.json`).
2. **Downstream locate & repair** — run **TAPIR** on the client to get candidate
   locations, extract AST context, decide which are truly affected, and edit.

You are the model. The old pipeline's LLM calls and prompt-stitching are gone;
those prompts now live in `references/` as criteria you apply directly. Only
deterministic work is scripted. GitHub access uses `gh`/`WebFetch` — no API keys.

## The two stages are decoupled — run them independently
Stage 1 and stage 2 share **no conversation context**. They communicate only
through files: stage 1 produces `bc_final_list.json` + `tapirN.json` +
`handoff.json` (the contract), and stage 2 validates that handoff before touching
a target project. Consequences:
- Once stage 1's BC list + patterns exist, stage 2 can run in a **fresh
  session / subagent** with no access to the mining discussion. Prefer this to
  keep context small.
- One stage-1 output can be **reused across many downstream clients** — run
  stage 2 once per client against the same `work_dir`.
- If the user only asks for one stage, do only that stage. Do not re-mine in
  stage 2, and do not require stage-2 inputs when only mining.

## Inputs — confirm before running (do not guess)
Before starting a stage, actively check its required inputs and **ask the user
for any that are missing or ambiguous**. Never invent paths, versions, owners,
or the `client_name`.

**Stage 1 (mining) requires:**
- `package_name` — dependency key used by the package manager. Do not infer it
  from the repository name.
- `upstream_repo` — exact `owner/repo`. Do not infer it from `package_name`.
- `tapir_client_name` — import specifier used in TAPIR patterns. Do not infer it
  from either of the preceding identities.
- `old_version`, `new_version` (tags, e.g. `v1.7.2` → `v2.0.0`).
- `new_version_source` — a checkout/copy of the new-version library (for
  docs/tests and source verification). If only the old version is available too,
  note it — diffing old↔new sharpens both docs and source checks.
- `work_dir` — where stage-1 artifacts are written.

**Stage 2 (locate & repair) requires:**
- `handoff.json` from a completed stage 1. It identifies and hashes the BC list
  and selected pattern file, package/repository/version identities, and whether
  the precision pass was reviewed.
- `target_client_dir` — the downstream project to repair.
- TAPIR runtime — the skill defaults to bundled `static_components/`. Before
  first use, ensure its production dependencies are installed with
  `cd static_components && npm install --omit=dev`. `--tapir-dist` or
  `$TAPIR_DIST` may override the bundled path.
- package manager, lockfile policy, and the validation commands that define
  success for this client (tests/build/lint/smoke checks).

## Scripts (deterministic, no LLM, no keys)
Run with `python3`. All under `scripts/`.
- `transform_patterns.py <bc_final_list.json> <client_name> [--out tapir.json]`
  → BC list to TAPIR pattern array.
- `handoff.py create|validate ...`
  → creates and validates the self-describing Stage-1 handoff, hashes, ID/pattern
  coverage, and TAPIR parser compatibility.
- `preflight.py --handoff ... --target-client-dir ...`
  → validates runtime/tooling, target dependency identity, package manager,
  lockfile policy, required validation commands, and supplemental-locator needs.
- `tapir_locate.py <target_dir> <pattern_file> [--tapir-dist DIR] [--per-pattern] [--out locations.json]`
  → runs `single-client-experiment.js`, parses `file:line:col + confidence`.
- `ripgrep_locate.py <target_dir> <pattern_file> [--globs ...] [--exclude-folders ...] [--out locations.json]`
  → supplemental candidate generator after TAPIR. It only handles supported
  name/import shapes, marks all hits `low`, and fails if any pattern needs TAPIR
  semantics rather than silently degrading.
- `ast_context.py <file.js> --target-root <target_client_dir> --locations-file locations.json --json`
  → smallest enclosing function/class/statement snippet while retaining every
  source location, BC ID, backend, and confidence attached to that snippet.
  Needs `pip install tree_sitter tree_sitter_javascript`.
- `repair_report.py init|validate ...`
  → creates and validates the required per-BC disposition and repair-validation
  ledger.

## Stage 1 — Upstream change mining
Read **references/bc-extraction.md** for the full criteria, **references/validation.md**
for refinement, and **references/schemas/bc.schema.json** for the BC shape.

1. **Collect candidate docs** from `new_version_source`: changelog/history/release
   notes, migration/upgrade guides, README, deprecation docs; plus breaking
   commits between versions (`gh api repos/<upstream_repo>/compare/<old>...<new>`).
   Include subjects with conventional-commit `!` and commit bodies/footers with
   `BREAKING CHANGE:`, not only subjects that start with that phrase. Diff
   old↔new docs; keep added lines and sections at/after `new_version`.
2. **Extract BCs** into `work_dir/bc_candidate_list.json` following the schema and
   the evidence-first / RequireInfoFlag rules. Choose `Changed_object.type`
   carefully — it drives pattern generation.
3. **Verify against source** (do not trust the changelog alone). For every
   locatable BC (`call`/`read`/`write`/`import`), confirm in `new_version_source`
   that the change is real — the method/property is actually removed/renamed, the
   signature actually changed, the module path actually gone (diff old↔new when
   available). Changelogs are often vague or stale (paper §3). Drop or downgrade
   any BC you cannot confirm rather than emit a pattern that fires false matches.
   See validation.md ("Source-code verification").
4. **Refine** every BC with `RequireInfoFlag: true` or with issue/PR/commit/URL
   references (validation.md): pull the evidence with `gh`/`WebFetch`, complete
   `Changed_object` and `Adaptation_method`, then do a final alignment pass so
   `Changed_object` covers all APIs named in the description/adaptation. Write
   `work_dir/bc_final_list.json` = `{"breaking_changes": [...]}`.
5. **Generate patterns** (read **references/pattern-language.md**):
   `transform_patterns.py bc_final_list.json <tapir_client_name> --out work_dir/tapir.json`.
   Prefer `Changed_object.targets[]` whenever module/class/member pairing or
   direct/default/named export shape matters. Generation must fail if any pattern
   is invalid; do not silently skip or broaden malformed entries. Do not bypass
   the transformer by handwriting TAPIR patterns during normal execution: the
   transformer is the deterministic compiler and validation boundary. The agent
   may only perform the documented `?` precision review after generation.
6. **Precision pass** — decide per pattern whether each `?` is justified and
   write `work_dir/tapirN.json` (same array shape, only `pattern` strings edited).
   This pass is mandatory: record `precision_reviewed: true` in the handoff.
7. **Create and validate the handoff**:
   `handoff.py create ... --bc-list bc_final_list.json --pattern-file tapirN.json --precision-reviewed --out handoff.json`,
   then `handoff.py validate handoff.json`. Stage 1 is
   incomplete until this succeeds.

Stage-1 deliverables (contract): `bc_final_list.json`, `tapir.json`,
`tapirN.json`, `handoff.json`.
The pattern files are JSON arrays with `pattern` + `changelogId`, consumable by
TAPIR's `require()`.

## Stage 2 — Downstream locate & repair
Read **references/repair.md** for decision criteria. This stage is self-contained:
it needs only a validated `handoff.json` and a target project — no stage-1
conversation context. It can start cold in a fresh session. Do not re-mine
breaking changes here.

1. **Preflight**: run `handoff.py validate`. Check Node, TAPIR entry, Python
   tree-sitter packages, target path, package manager, lockfile policy, and
   validation commands. TAPIR supports the JavaScript subset (`.js/.mjs/.cjs/.es`);
   JSX/TypeScript sources block the default run because they would make coverage
   incomplete. Then run `preflight.py ... --out preflight.json`. Stop if any
   required check fails.
2. **Locate with TAPIR** (mandatory baseline):
   `tapir_locate.py <target_client_dir> <handoff.pattern_file> --per-pattern --out locations.json --run-report tapir-run.json`.
   The wrapper pre-parses every TAPIR-supported source with TAPIR's own parser,
   so a `.js` file containing unsupported syntax cannot be silently skipped.
   TAPIR failure blocks the stage; an empty result is meaningful only after a
   successful run. ripgrep may run afterwards as supplemental recall for
   supported patterns with `--allow-partial`, never as a TAPIR replacement.
   Review stderr/listed skipped patterns; TAPIR already covers them. Work on a
   **copy** of the client (ignore `node_modules`) so edits are reviewable.
   If handoff preflight reports `supplemental_required=true` (for example named
   export aliases that TAPIR records using the local name), the supplemental
   ripgrep scan is mandatory: run with `--allow-partial --run-report
   supplemental-run.json`; its candidates must be reviewed.
3. **Extract context** per affected file:
   `ast_context.py <file> --target-root <target_client_dir> --locations-file locations.json --json`.
4. **Initialize `repair_report.json`** with
   `repair_report.py init --handoff handoff.json --preflight preflight.json --tapir-run tapir-run.json`.
   Add `--supplemental-run supplemental-run.json` when preflight requires it.
   It binds the report to artifact hashes and a successful complete TAPIR run.
   Every BC, including environment/config/not-found cases, must receive a final
   disposition.
5. **Decide & repair** each snippet: map `pattern_id`→`changelogId`→BC in
   `bc_final_list.json`; apply repair.md (confirm real impact, watch same-named
   unrelated APIs, treat `low` confidence cautiously, preserve formatting, edit
   in place with Edit). Skip uncertain/unaffected snippets.
6. **Update dependencies**: set `package_name` to `new_version` (strip leading `v`) in
   the client `package.json`; add any newly required deps.
7. **Config/environment BCs**: scan config files and check environment/runtime
   requirements; record their dispositions even when no source edit is needed.
8. **Validate the repair**: update the lockfile according to the agreed policy,
   then run the client's existing targeted tests/build/lint/smoke commands.
   Record every command and result in `repair_report.json`. If validation cannot
   run, mark `unverified` and report that limitation; a failing validation means
   the stage is not complete.
9. **Validate the ledger** with
   `repair_report.py validate repair_report.json`.
   It rejects missing/extra BC IDs, manual/blocked/pending dispositions, artifact
   tampering, incomplete TAPIR coverage, and validation commands that differ
   from preflight or did not all pass. It also verifies that the target
   `package.json` uses the handoff version, the declared lockfile policy is
   satisfied, and required supplemental coverage used the same target/patterns.
10. **Config-type BCs**: for `Changed_object.type == "config"`, TAPIR doesn't
   apply — scan for the named config file(s) and apply the same criteria.

## Notes
- Keep pattern files as JSON arrays; never collapse to an object.
- `environment`-type BCs are recorded but not locatable by TAPIR.
- All locator columns are zero-based UTF-8 byte offsets and all file paths are
  exact normalized relative paths. Do not match locations by basename.
- Prefer running one library end-to-end and reviewing the diff before batching.
