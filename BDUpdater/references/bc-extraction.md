# Stage 1a — Mining breaking changes from upstream docs

You are the analyst. There is no separate LLM to call; you read the sources and
author the structured BC list yourself. Apply these criteria (ported from the
original DepRepair extraction prompts).

## Scope
- Only breaking changes introduced in the **target new major version**.
- JavaScript breaking changes only. Ignore TypeScript-only changes.
- A breaking change is any modification that makes previously-working client
  code fail (error at import/runtime) or silently change behavior.

## Where to look (candidate documents), ranked by relevance
1. Changelog / history / release notes (`CHANGELOG.md`, `HISTORY.md`, release notes)
2. Migration / upgrade guides (`migration-guide.md`, `upgrading.md`, `changes-in-v3.md`)
3. `README`, deprecation docs
4. External links referenced by the above
5. Commits between old and new version whose subject/body/footer contains
   breaking-change markers: `BREAKING CHANGE:`, conventional-commit `!`
   (`feat!:`), or equivalent explicit language (fetch with `gh`/git; see
   validation.md)

Filter changelog content to sections **at or after** the new version. When both
old and new copies of a doc exist, diff them and keep only added lines.

Keyword hints that a passage is relevant: `breaking`, `deprecat`, `remove`,
`migrat`, `replac`.

## Evidence-first / non-hallucination
- Prefer explicitly marked BCs ("BREAKING CHANGE", "Major", "Incompatible").
- If none are marked, infer only from the provided content.
- Every description, example, and claim must be backed by the sources. Do not
  guess entities, versions, or adaptation code from general knowledge.

## Authoring each BC (schema: references/schemas/bc.schema.json)
- **Changed_object** must let downstream code be located. Prefer `targets[]` to
  preserve each module/class/member/export-shape tuple. Do not flatten unrelated
  classes or modules into parallel arrays. TAPIR does not support wildcard
  member names: if the affected member set cannot be enumerated, retain the BC
  but do not fabricate `methodName/propertyName: ["*"]`.
- Pick `Changed_object.type` carefully — it drives pattern generation:
  - `call` — method call changes (signature, args, options)
  - `read` / `write` — property get / set changes
  - `import` — import/require changes (set full import specifiers in
    `moduleName`; use `"*"` alone only when the entire package/subpath space is affected)
  - `config` — change in an external config file (set `moduleName` to the file, e.g. `webpack.config.js`)
  - `environment` — runtime/environment change (not locatable by TAPIR; still record it)
- For a `call` BC that breaks **only** for specific argument counts/types, and the
  evidence says so explicitly, set `Changed_object.argFilters` (arity and/or
  per-argument types). This is optional and narrowing — omit it when unsure, or a
  wrong filter hides affected code. See pattern-language.md ("Call argument
  filters") for the grammar and the high-confidence rule.
- **Adaptation_method**: give explicit Before → After code. Ban vague phrasing
  like "use customized alternatives" unless truly no alternative exists. Do
  **not** infer the migration from the changelog sentence — especially when it
  uses words like *refactored / split / reworked / replaced / renamed / merged /
  moved*. Those mean the API shape changed without a stated drop-in; the fix must
  come from the PR/source/migration guide, or the BC gets `RequireInfoFlag: true`
  (see validation.md, "Never infer the migration from changelog wording").
- **Reference**: include every source — URLs, issue/PR numbers, commit SHAs.

## RequireInfoFlag — when to defer to stage 1b
Set `RequireInfoFlag: true` and describe exactly what is missing in `RequireInfo`
whenever any of these hold:
- Incomplete enumeration ("like", "such as", "etc.") that you cannot turn into
  a precise list/regex.
- Adaptation guidance is generalized or missing.
- Terminology/parameters are undefined.

BCs with `RequireInfoFlag: true`, or with issue/PR/commit references, go through
stage 1b refinement (validation.md) before pattern generation.

## Output
Write `bc_candidate_list.json` (then refined to `bc_final_list.json`) as
`{"breaking_changes": [ ... ]}`. IDs are unique non-negative integers starting
at 0. After pattern generation and precision review, create and validate
`handoff.json`; Stage 1 is incomplete without it.
