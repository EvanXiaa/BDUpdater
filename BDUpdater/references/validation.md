# Stage 1b — Refining breaking changes with external evidence

Original DepRepair ran a tool-calling loop (`searchForIssue`, `searchForCommit`,
`fetchDirectoryStruc`, `issueByKeywords`, `searchForWebsite`). You do this
directly with native tools. Refine any BC with `RequireInfoFlag: true` or with
issue/PR/commit/URL references until it is clear, complete, and locatable.

## Which evidence to gather, by cue
Route on what the description/references contain (hard rules from the original):

| Cue in BC | Action (native tool) |
|---|---|
| Issue/PR of **this** library (e.g. `#2251`, `/pull/2299`) | `gh issue view N` / `gh pr view N --json title,body,files,commits` |
| Issue/PR of **another** library, or a doc URL | `WebFetch` that URL |
| A commit SHA | `gh api repos/<owner>/<repo>/commits/<sha>` or `git show <sha>` |
| No migration steps and no reference; an old API was removed | Search issues/PRs by keyword: `gh search issues --repo <owner>/<repo> "<keyword>"` |
| API entry point is implicit (unsure of classPath/module) | List the new-version source tree (Glob/`ls`) to resolve the path |

Source code proves that an entity/signature exists and what it does. It does
**not** by itself prove that an old usage should migrate to a new usage. The
old→new mapping requires a PR/commit diff, official migration guide, versioned
tests/examples, or another explicit upstream source.

Prefer detailed issue/PR context over guessing. When a PR is referenced, its
changed files and commit messages are the strongest evidence for the exact
affected entities.

## Never infer the migration from changelog wording
The changelog tells you *that* something broke, rarely *how to fix it*. The
`Adaptation_method` (and any replacement API named in it) must come from
evidence — the referenced PR/issue/commit diff, the new-version source, official
migration guides, or library tests/examples — never from paraphrasing the
changelog sentence.

Treat these changelog verbs as a hard trigger to open the PR/source before
writing `Adaptation_method`: **refactored, reworked, split, merged, replaced,
renamed, moved, consolidated, unified, redesigned, folded into, superseded**.
Such wording means "the shape changed but I'm not handing you a drop-in
replacement." Do not turn "X was refactored into Y and Z" into "replace X with
Y/Z" — Y and Z usually have different signatures/semantics and are not a
substitution for X.

Before finalizing `Adaptation_method`, require all of:
- the replacement API (if any) is confirmed to **exist** in the new source, and
- its **signature/semantics** are read from the source (params differ? return
  differs? it is an internal helper, not a public swap?), and
- the mapping from old usage to new usage is backed by the PR/guide/tests, not
  invented.

If the sources do **not** provide a concrete migration (common when the removed
API was internal, or the PR only says "refactored"), set `RequireInfoFlag: true`
and state in `RequireInfo` that no official migration exists and the fix depends
on how the client used the old API. Do not fabricate a Before → After. A wrong
`Adaptation_method` misleads stage-2 repair even when the location is correct.

## GitHub access
- No API keys in this skill. Use the `gh` CLI (already authenticated) or
  `WebFetch` for public pages.
- To find breaking commits between versions:
  `gh api repos/<upstream_repo>/compare/<oldTag>...<newTag>` and inspect subject,
  body and footer for `BREAKING CHANGE:` and conventional-commit `!` markers.

## Refinement criteria (when is a BC "done")
Clear `RequireInfoFlag` to `false` only when all hold:
- **Clarity** — every entity mentioned is explicit.
- **Scope** — `Changed_object` lists *all* affected APIs implied by the
  description; no vague wording. Do not introduce unrelated APIs found in noisy
  context — stay anchored to `BC_description`.
- **Migration** — explicit adaptation instructions, ideally Before → After code
  taken from library-provided examples/tests.
- No hallucination; examples are evidence-backed.

Keep the JSON structure identical to the schema — refine field *contents*, add
no new fields.

## Source-code verification (stage 1, before final alignment)
Changelogs are frequently vague, incomplete, or stale (paper §3: they often do
not even say which APIs a change affects). Before a BC becomes a pattern,
confirm the change is *real in the code* of `new_version_source`. This is the
cheapest defense against patterns that fire on non-existent changes.

For each locatable BC (`call`/`read`/`write`/`import`), check the relevant kind:
- **Removed / renamed method or property**: grep the new-version source for the
  symbol. Expect it **absent** (or moved) and require delta evidence: old/new
  source diff, the introducing commit/PR diff, or versioned tests. Seeing only
  the new state is not enough to prove that the target upgrade removed it.
- **Signature / behavior change**: open the function in the new version and
  confirm the described difference (param added/removed/reordered, return type,
  the new behavior). Diff against `old_version` when available to see the actual
  delta.
- **New replacement API** named in `Adaptation_method`: confirm it **exists** in
  the new version (e.g. `textConverted()` is really defined). A migration that
  points at a non-existent API is a defect.
- **Import / module removal or move**: check the module path is gone/relocated —
  inspect `package.json` (`main`, `exports`), the `lib/`/`src/` layout, or the
  build output. Confirm the exact old import specifier no longer resolves.
- **Arg-conditional break** (before setting `argFilters`): verify in the source
  that the break truly depends on argument count/type, not just the method name.
  If you cannot confirm the condition, omit `argFilters` (pattern-language.md).

Outcome per BC:
- **Confirmed** → keep; tighten `Changed_object` to what the code shows.
- **Cannot confirm** → do not emit a locatable pattern. Either drop the BC or
  keep it as a non-locatable recorded note; do not keep a `call/read/write/import`
  type with uncertainty hidden only in prose.

## Final alignment
Before generating patterns, do one pass over each BC to ensure `Changed_object`
covers every API named in `BC_description` and `Adaptation_method` (methods,
properties, modules). This mirrors the original `final_alignment` step and
directly improves TAPIR recall.

## (Optional) Undocumented BCs from tests
If the library ships tests, diff old-vs-new test files. A test signals a BC when
it asserts a *new* error/exception, stricter input validation, changed
return/behavior, new immutability, or a renamed/removed API. Ignore tests that
only cover internal logic, formatting, non-breaking additions, or performance.
Author any such finding with the same schema and merge it into the list
(consolidate near-duplicates that describe the same underlying change).
