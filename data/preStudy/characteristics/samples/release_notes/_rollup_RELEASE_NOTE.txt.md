v4.0.0
## 4.0.0

_2023-10-05_

### BREAKING CHANGES

#### General Changes

- The minimal required Node version is now 18.0.0 (#5142)
- The browser build now relies on a WASM artifact that needs to be provided as well (#5073)
- The NodeJS build now relies on an optional native binary; for unsupported platforms, users can use the `@rollup/wasm-node` package that has the same interface as Rollup but relies on WASM artifacts (#5073)
- The "with" syntax for import attributes is not yet supported, awaiting support in SWC (#5073)
- The `INVALID_IMPORT_ASSERTION` error code has been replaced with `INVALID_IMPORT_ATTRIBUTE` (#5073)
- Rollup will now warn for `@__PURE__` and `@__NO_SIDE_EFFECTS__` annotations in invalid locations (#5165)
- If an entry module starts with a shebang comment `#!...`, this comment will be prepended to the output for `es` and `cjs` formats (#5163)
- File hashes will now use url-safe base64 encoded hashes (#5155)
- The maximum hash length has been reduced to 22 characters (#5155)
- The `RollupWarning` type has been removed in favor of the `RollupLog` type (#5147)

#### Changes to Rollup Options

- Acorn plugins are no longer supported, the `acornInjectPlugins` option has been removed (#5073)
- The `acorn` option has been removed (#5073)
- `output.externalImportAssertions` has been deprecated in favor of `output.externalImportAttributes` (#5073)
- `inlineDynamicImports`, `manualChunks` and `preserveModules` have been removed on input option level: Please use the corresponding output options of the same names (#5143)
- Removed output options (#5143):
  - `output.experimentalDeepDynamicChunkOptimization`: This option is no longer needed as Rollup now always runs the full chunking algorithm
  - `output.dynamicImportFunction`: Use the `renderDynamicImport` plugin hook instead
  - `output.namespaceToStringTag`: Use `output.generatedCode.symbols` instead
  - `output.preferConst`: Use `output.generatedCode.constBindings` instead

#### Plugin API Changes

- For `this.resolve`, the default of the `skipSelf` option is now `true` (#5142)
- `this.parse` now only supports the `allowReturnOutsideFunction` option for now (#5073)
- Import assertions now use the [new import attribute AST structure](https://github.com/estree/estree/blob/master/experimental/import-attributes.md) (#5073)
- "assertions" have been replaced with "attributes" in various places of the plugin interface (#5073)
- If the import of a module id is handled by the `load` hook of a plugin, `rollup.watch` no longer watches the actual file if the module id corresponds to a real path; if this is intended, then the plugin is responsible for calling `this.addWatchFile` for any dependency files (#5150)
- The normalized input options provided by `buildStart` and other hooks no longer contain an `onwarn` handler; plugins should use `onLog` instead (#5147)
- `this.moduleIds` has been removed from the plugin context: Use `this.getModuleIds()` instead (#5143)
- The `hasModuleSideEffects` flag has been removed from the `ModuleInfo` returned by `thi s.getModuleInfo()`: Use `moduleSideEffects` on the `ModuleInfo` instead (#5143)

### Features

- Improve parsing speed by switching to a native SWC-based parser (#5073)
- Rollup will now warn for `@__PURE__` and `@__NO_SIDE_EFFECTS__` annotations in invalid locations (#5165)
- The parser is now exposed as a separate export `parseAst` (#5169)

### Bug Fixes

- Rollup no longer tries to watch virtual files if their name corresponds to an actual file name; instead, plugins handle watching via `this.addWatchFile()` (#5150)

### Pull Requests

- [#5073](https://github.com/rollup/rollup/pull/5073): [v4.0] Switch parser to SWC and introduce native/WASM code (@lukastaegert)
- [#5142](https://github.com/rollup/rollup/pull/5142): [v4.0] Set the default of skipSelf to true (@TrickyPi)
- [#5143](https://github.com/rollup/rollup/pull/5143): [v4.0] Remove deprecated features (@lukastaegert)
- [#5144](https://github.com/rollup/rollup/pull/5144): [v4.0] Imporve the performance of generating ast and rollup ast nodes (@TrickyPi)
- [#5147](https://github.com/rollup/rollup/pull/5147): [v4.0] Remove onwarn from normalized input options (@lukastaegert)
- [#5150](https://github.com/rollup/rollup/pull/5150): [v4.0] feat: Do not watch files anymore if their content is returned by the load hook (@TrickyPi)
- [#5154](https://github.com/rollup/rollup/pull/5154): [v4.0] Add parse option to allow return outside function (@lukastaegert)
- [#5155](https://github.com/rollup/rollup/pull/5155): [v4.0] feat: implement hashing content in Rust (@TrickyPi)
- [#5157](https://github.com/rollup/rollup/pull/5157): [v4.0] Handle empty exports (@lukastaegert)
- [#5160](https://github.com/rollup/rollup/pull/5160): chore(deps): lock file maintenance minor/patch updates (@renovate[bot])
- [#5163](https://github.com/rollup/rollup/pull/5163): [v4.0] feat: preserve shebang in entry module for CJS and ESM outputs (@TrickyPi)
- [#5164](https://github.com/rollup/rollup/pull/5164): [v4.0] fix: also strip BOM from code strings in JS (@TrickyPi)
- [#5165](https://github.com/rollup/rollup/pull/5165): [v4.0] warn for invalid annotations (@lukastaegert)
- [#5168](https://github.com/rollup/rollup/pull/5168): [v4.0] Ensure we support new import attribute "with" syntax (@lukastaegert)
- [#5169](https://github.com/rollup/rollup/pull/5169): [v4.0] Expose parser (@lukastaegert)