# Stage 2 — Repair decision criteria

TAPIR gives candidate locations (recall). You provide precision and the actual
fix. For each AST context snippet (from ast_context.py) plus the matching BC
(via `changelogId`), decide and act. Ported from the original repair prompt.

## Decide: is this snippet actually affected?
- Confirm the snippet is **definitively** hit by the BC per `BC_description`.
- Watch for **same-named but unrelated APIs**. The matched call/property may not
  come from the target library — judge from context (imports, receiver origin).
  TAPIR `low` confidence (uncertain receiver, from a `?` pattern) is an explicit
  signal to scrutinize provenance before changing anything.
- Some usages remain valid under the new version — confirm a change is truly
  needed.
- If the break is conditional on internal/runtime state (flags, library
  internals) and the snippet only *might* be affected: do **not** edit. Note
  what additional information would decide it, and move on.

## Act: when affected
- Apply the evidence-backed `Adaptation_method` (Before → After). If it appears
  unsafe or incomplete, do not invent a better migration from model knowledge:
  reopen the cited upstream evidence, record the new evidence in the repair
  report, or leave the hit for manual handling.
- Edit in place, preserving structure and formatting exactly — indentation,
  braces, layout — so the change is a drop-in replacement.
- New `import`/`require` may be added in place if it has no side effects on
  existing variables; it need not be hoisted to top level.
- If a repair needs changes elsewhere in the file (side effects), prefer a
  whole-file pass for that file rather than an unsafe local edit.
- Do **not** convert CommonJS to ESM.
- If the BC only **adds new optional configuration with no side effects**, you
  may conservatively patch to preserve pre-upgrade behavior.

## Do not
- No speculative or heuristic changes.
- No edits to unaffected/uncertain snippets.

## Dependencies
- After repairing a client for package `L` at version `V`, set `L` to `V`
  (strip a leading `v`) in the client `package.json`.
- If a fix introduces a new dependency, add it (use a stable released version).
- Update `dependencies` if present, else `devDependencies`.
- Respect the user's package manager/workspace and lockfile policy. Do not hand
  edit a lockfile; use the package manager when lockfile updates are requested.

## Completion ledger
Initialize `repair_report.json` from the validated handoff, preflight report,
and TAPIR run report so the completion ledger is hash-bound to the exact inputs.
Every BC must end as one of:
`repaired`, `unaffected`, `not_found`, `manual`, `blocked`, or
`environment_checked`. Record changed files, evidence, and notes. Then record
the install/test/build/lint/smoke commands declared by preflight. A completed run
may not retain `manual`, `blocked`, or `pending`, and every declared command must
be recorded as passed.

## Config-type BCs
For BCs with `Changed_object.type == "config"`, TAPIR access-path matching does
not apply. Instead scan the client for the named config file(s)
(`moduleName`, e.g. `webpack.config.js`) and apply the same decide/act criteria
to their contents.
