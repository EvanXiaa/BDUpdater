v13.0.0
## [13.0.0](https://github.com/webpack-contrib/copy-webpack-plugin/compare/v12.0.2...v13.0.0) (2025-02-27)


### ⚠ BREAKING CHANGES

* switch from `globby` and `fast-glob` to `tinyglobby` ([#795](https://github.com/webpack-contrib/copy-webpack-plugin/issues/795)) ([19fd937](https://github.com/webpack-contrib/copy-webpack-plugin/commit/19fd937705ccb2161619e1e919f0b37b47453368))

For more information please visit [`tinyglobby`](https://github.com/SuperchupuDev/tinyglobby).

The breaking change only affects the developer who used these options - [`gitignore`](https://github.com/sindresorhus/globby#gitignore) and [`ignoreFiles`](https://github.com/sindresorhus/globby#gitignore) in the `globOptions` option.

Please migrate to the [`ignore`](https://github.com/SuperchupuDev/tinyglobby#options) option.

### Bug Fixes

* concurrency option is limited to files now ([#796](https://github.com/webpack-contrib/copy-webpack-plugin/issues/796)) ([d42469c](https://github.com/webpack-contrib/copy-webpack-plugin/commit/d42469cfdc99a81f0f0ba97f6561f0e0db143994))
* the order of patterns provided by the developer is respected
