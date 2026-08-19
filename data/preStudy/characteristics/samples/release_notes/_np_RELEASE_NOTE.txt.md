v10.0.0
### Breaking

- Remove the `--yarn` flag (#730)  4b3b599
  - The functionality is replaced by `--package-manager`. See below.

### Improvements

- Add `--package-manager` flag (#730)  4b3b599
  - This acts like the [`packageManager` field](https://nodejs.org/api/packages.html#packagemanager) in package.json. `np` will default to reading package.json, and look for lockfiles to determine the best package manager as a last resort.
- Add pnpm support (#730)  4b3b599

https://github.com/sindresorhus/np/compare/v9.2.0...v10.0.0