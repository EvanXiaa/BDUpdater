# TAPIR detection patterns — syntax, generation, and `?` refinement

TAPIR (casa.au.dk) locates library API usage in client code by matching
*access-path patterns*. Stage 1 must emit a pattern file TAPIR can consume;
stage 2 feeds it to `command/single-client-experiment.js`.

## Pattern file contract (hard requirement)
TAPIR reads the file with `require()`, so it must be a JSON **array**. Each entry:
- `pattern` (string, required) — the access-path pattern.
- `changelogId` (required) — links a match back to a BC `Id`. Stage 2 uses this
  to fetch the right BC description when repairing.
- optional: `deprecation` (bool), `benign` (bool), `question` (string), `id`.

`transform_patterns.py` produces exactly this shape from `bc_final_list.json`.
Do not hand-edit the array into an object; keep it an array.

## Pattern syntax (as used here)
- `import <spec>` — matches `require`/`import` of module(s). Spec is a glob set,
  e.g. `{target-lib/**/*,target-lib}`. `**` = any directories, `*` = any file.
- `call <accessPath>` — matches a call. `read` / `write` match property get/set.
- Access path: `{<lib>,<lib/**/*>}?**.{m1,m2}`
  - `<lib>` and `<lib/**/*>` are import origins (angle brackets = "imported from").
  - `?` marks an **uncertain** receiver: match even when we cannot prove the
    receiver came from the target library (recall over precision).
  - `**.` walks any property chain to the final `{...}` member set.
  - `{a,b}` is a disjunction. **`{*}` is not a member wildcard in this TAPIR
    implementation**; it matches a property literally named `*` and must never
    be generated. Use an access-path wildcard such as `p**` for call chains, or
    a supplemental AST scan when arbitrary property reads/writes are required.
- Optional call filters (see the dedicated section below). Only meaningful on
  `call` patterns, e.g. `call <target-lib> [2,2]` or
  `call <target-lib>?**.{set} [1,2] 0:string`.

## Call argument filters (arg-filter patterns)
Filters narrow a `call` pattern to specific argument shapes — for BCs that only
break for certain argument counts/types (TAPIR paper §5, Fig.3). They are
emitted from `Changed_object.argFilters` (schema) and appended to a **`call`**
pattern (filters are ignored on `read`/`write`, so a filtered BC produces a
single `call` pattern instead of the read/write split).

Grammar (as accepted by the bundled dist):
- `[n,m]` — call has between `n` and `m` args. **Both bounds required.** Open
  ranges `[n,]` are NOT supported by the matcher; encode "at least n" as a large
  `maxArgs` (e.g. `[2,99]`).
- `i:t` — the `i`-th argument (**0-based**) has type `t`.
- `i:{t1,t2}` — union of types.
- Types: `string number boolean undefined object array function function1
  function2 function3` (`functionN` = a function with N params; the paper writes
  `function[Int]`), or a **literal** (`'text'`, a number, `true`, `false`,
  `undefined`, `NaN`).

### Three different confidence concepts
- **Evidence confidence**: upstream sources prove the BC is conditional on this
  argument predicate. This decides whether an `argFilters` entry may exist.
- **Filter soundness**: the predicate exactly covers the affected call set. A
  wrong predicate creates false negatives even if TAPIR evaluates it perfectly.
- **Match confidence**: TAPIR can or cannot prove the predicate at a specific
  client AST node. Literals, function/arrow expressions, object/array
  expressions, template literals, and some simple unary expressions can be
  high confidence; variables/call results are usually low.

Arity `[n,m]` is read directly from the call AST, but it is only safe to add when
upstream evidence proves the BC is actually restricted to that arity.

Filters are a **narrowing** operation. A wrong or over-tight filter removes true
matches → **false negatives** (silently missed affected code), which is the one
failure mode the whole approach is designed to avoid.

### Hard rule: only write argFilters when the condition is evidence-backed
Write `argFilters` **only** when the docs/issue/PR/source clearly state the break
is conditional on argument count or type (e.g. "throws when a GET/HEAD Request is
constructed with a body", "affects debounce/throttle only when the 3rd arg is
boolean"). Otherwise **omit `argFilters` entirely** and let the plain member
pattern match broadly — the agent filters at repair time.

- Prefer arity (`[n,m]`) over type filters only when the affected arity is
  explicitly proven; AST readability does not by itself make a filter sound.
- Use a type filter only when the type genuinely distinguishes affected from
  unaffected calls (e.g. lodash `dropWhile [3,3] 2:function` vs the shorthand).
- If clients typically pass the deciding argument as a non-literal, a type
  filter buys little (it degrades to `low`) — consider leaving it off.
- When in doubt, no filter. Broader recall + agent judgment beats a false
  negative. The transform script fails instead of silently broadening or
  narrowing malformed filters.

## Changed_object → pattern mapping (what the script does)
- Prefer `Changed_object.targets[]`. Each target preserves:
  - `moduleName`
  - `className`
  - `memberName`
  - `exportStyle`: `direct|default|named|member|instance|deep-module`
  - `uncertain`: whether `?**` is allowed
- Use `instance` for methods/properties reached through library-created runtime
  objects (the class name is semantic documentation, not an exported access-path
  segment). Use `member` for exported/static paths such as `<pkg>.Class.method`.
- The legacy `moduleName/className/methodName/propertyName` arrays remain
  supported only when their pairing is unambiguous. Multiple classes with
  unqualified members must be rewritten as `targets[]`; the transformer fails
  rather than flattening them into whole-library matches.
- Structured `direct/default/named/member/deep-module` targets require an
  explicit `moduleName`; only `instance` may use `null` to mean objects flowing
  from the package root or subpaths.
- TAPIR records the local name of named-import aliases. Named targets are
  therefore marked `requiresSupplemental=true`; handoff preflight makes the
  supplemental ripgrep candidate scan mandatory for those BCs.
- `type: call`
  - explicit methods: emit **both** a `call ...{methods}` and a `read ...{methods}`
    pattern. The `call` form matches invocations — including constructor/factory
    calls `new M()` / `M()`, which `read`/`write` miss; the `read` form catches
    the callee being read before invocation (e.g. passed as a callback). `write`
    is not emitted — it essentially never matches a call site and only adds noise
    (verified against the dist).
  - `argFilters` present: emit a single `call {<lib>,<lib/**/*>}?**.{methods} <filters>`
    (filters only work on `call`).
  - empty or wildcard member names fail generation. A direct/default-export
    callable is represented by a structured target with
    `exportStyle: direct|default` and no `memberName`.
- `type: import`
  - `moduleName` must be non-empty. Relative subpaths are normalized under the
    TAPIR client name; only a final `.js` suffix is removed.
  - `"*"` must appear alone and means the root module plus all its subpaths.
- `type: read` / `write`: every target must have an explicit `memberName`.
- `type: environment` / `config`: **not** emitted as access-path patterns
  (environment isn't locatable; config is handled by file scan in stage 2).

Note: one BC often yields several patterns (e.g. `call` + `read`), so TAPIR can
report the same source location more than once. `tapir_locate.py` and
`ripgrep_locate.py` deduplicate by `(changelogId, file, line, column)`, keeping
the higher confidence, so `locations.json` has one entry per real hit.

The transform argument is `tapir_client_name`, not the package name or repository
name. These three identities must be supplied independently.

## `?` refinement → tapirN.json (precision pass)
`?` boosts recall but over-use floods false positives. After generating
`tapir.json`, decide per pattern whether each `?` is justified and write
`tapirN.json`. Keep the array shape identical; only edit `pattern` strings.

Remove `?` (tighten) when:
- The API name is **generic/typical** (e.g. `cancel`, `run`, `close`, `get`,
  `text`) — it would match many unrelated objects.
- The library is rarely re-exported/wrapped across modules, so the receiver is
  usually a direct import anyway.

Keep `?` (stay loose) when:
- The API name is **unique** to the target library, or
- The library is frequently wrapped/re-exported, so receivers legitimately lose
  their provenance across files (TAPIR analysis is not cross-file).

The precision pass is mandatory. Stage 2 runs the file selected by
`handoff.json`; `precision_reviewed` must be true. Low-confidence matches
(`?`/uncertain) remain visible for repair-time provenance review.

## Locator backends
**TAPIR is the mandatory baseline.** A TAPIR failure blocks Stage 2; it may not
be reinterpreted as zero matches.

`ripgrep_locate.py` is only a supplemental candidate generator. It adds
low-confidence candidates for dot/computed members, named/destructured aliases,
and static/dynamic imports, but it cannot prove provenance or call semantics and
still does not provide complete JavaScript dataflow coverage. It refuses arg/type-filter
patterns by default. After a successful TAPIR baseline, `--allow-partial` may
scan supported patterns while explicitly listing every skipped pattern. Its output marks
`backend=ripgrep` and `filter_applied=false`.
