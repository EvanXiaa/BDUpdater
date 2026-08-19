v6.0.0
## Breaking Changes

* AVA now requires Node.js versions 18.18, 20.8 or 21. Versions 14 and 16 are no longer supported. #3251 #3216
* When tests finish, worker threads or child processes are no longer exited through `proces.exit()`. If your test file does not exit on its own, the test run will time out. #3260
* Changes to watch mode #3218:
  * Watch mode can no longer be started via the `ava.config.*` or `package.json` configuration.
  * The `ignoredByWatcher` configuration has moved to the `watchMode` object, under the `ignoreChanges` key.
  * Watch mode now uses the built-in [`fs.watch()`](https://nodejs.org/api/fs.html#fswatchfilename-options-listener) in recursive mode. This is supported on Linux in Node.js 20 or newer, and MacOS and Windows in Node.js 18 as well. There are [caveats](https://nodejs.org/api/fs.html#caveats) to keep in mind.

* Failed assertions now throw, meaning that any subsequent code is not executed. This also impacts the type definitions. #3246
* [Only native errors](https://nodejs.org/api/util.html#utiltypesisnativeerrorvalue) are now considered errors by the `t.throws()` and `t.throwsAsync()` assertions. [`Object.create(Error.prototype)` is **not** a native error](Object.create(Error.prototype)). #3229
* Changes to modules loaded through the `require` configuration #3184:
  * If such modules export a default function, this function is now invoked.
  * Local files are loaded through `@ava/typescript` if necessary.

## Improvements

### Rewritten watcher

The watcher has been rewritten. It’s now built on [`fs.watch()`](https://nodejs.org/api/fs.html#fswatchfilename-options-listener) in recursive mode.

[`@vercel/nft`](https://github.com/vercel/nft)  is used to perform static dependency analysis, supporting ESM and CJS imports for JavaScript & TypeScript source files. This is a huge improvement over the previous runtime tracking of CJS imports, which did not support ESM.

Integration with [`@ava/typescript`](https://github.com/avajs/typescript) has been improved. The watcher can now detect a change to a TypeScript source file, then wait for the corresponding build output to change before re-running tests.

The ignoredByWatcher configuration has moved to the watchMode object, under the ignoreChanges key.

See #3218 and #3257.

### Failed assertions now throw

Assertions now throw a `TestFailure` error when they fail. This error is not exported or documented and should not be used or thrown manually. You cannot catch this error in order to recover from a failure, use `t.try()` instead.

All assertions except for `t.throws()` and `t.throwsAsync()` now return `true` when they pass. This is useful for some of the assertions in TypeScript where they can be used as a type guard.

Committing a failed `t.try()` result now also throws.

See #3246.

### `t.throws()` and `t.throwsAsync()` can now expect any error

By default, the thrown error (or rejection reason) must be a native error. You can change the assertion to expect any kind of error by setting `any: true` in the expectation object:

```js
t.throws(() => { throw 'error' }, {any: true})
```

See #3245 by @adiSuper94.

### The `require` configuration is now more powerful

It now loads ES modules.

Local files are loaded through `@ava/typescript` if necessary, so you can also write these in TypeScript.

If there is a default export function, it is invoked after loading. The function is awaited so it can do asynchronous setup before further modules are loaded. Arguments from the configuration can be passed to the function (as a [[structured clone](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)).

See #3184 by @sculpt0r.

### Other changes worth noting

* Internal events can now be observed (experimentally). See #3247 by @codetheweb. It’s experimental and undocumented.
* You can now use `t.timeout.clear()` to restore a previous `t.timeout()`. #3221
* Code coverage is flushed to disk at opportune moments. #3220

## New Contributors
* @sculpt0r made their first contribution in https://github.com/avajs/ava/pull/3184
* @ZachHaber made their first contribution in https://github.com/avajs/ava/pull/3233
* @adiSuper94 made their first contribution in https://github.com/avajs/ava/pull/3245
* @bricker made their first contribution in https://github.com/avajs/ava/pull/3250

**Full Changelog**: https://github.com/avajs/ava/compare/v5.3.1...v6.0.0