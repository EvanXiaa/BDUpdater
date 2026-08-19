v59.0.0
### Breaking

- Rename `no-array-push-push` rule to `prefer-single-call` (#2617)  e117783
- Rename `no-length-as-slice-end` rule to `no-unnecessary-slice-end` (#2614)  1922df1

### New rules

- Add [`prefer-import-meta-properties`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-import-meta-properties.md) (#2607)  1f6e172
- Add [`no-unnecessary-array-flat-depth`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unnecessary-array-flat-depth.md) (#2618)  c63e698
- Add [`no-unnecessary-array-splice-count`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-unnecessary-array-splice-count.md) (#2614)  1922df1

### Improvements

- Support `Float16Array` (#2622)  9e50568
- `prefer-node-protocol`: Support `process.getBuiltinModule()` (#2611)  056364d
- `no-unnecessary-slice-end`: Support checking `Infinity` (#2614)  1922df1

---

https://github.com/sindresorhus/eslint-plugin-unicorn/compare/v58.0.0...v59.0.0