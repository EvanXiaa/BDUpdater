v2.0.0
<a name="2.0.0"></a>
# [2.0.0](https://github.com/Updater/rollup-plugin-peer-deps-external/compare/25154125c0ef1f875d64c34ea24a668a7a72a872...v2.0.0) (2017-12-11)


### Features

* refactor plugin to also handle matching "module paths" ([07efd49](https://github.com/Updater/rollup-plugin-peer-deps-external/commit/07efd49))


### BREAKING CHANGES

* The plugin will now add “module paths” to `external`. E.g.: If `lodash`
is in `peerDependencies`, an import of `lodash/map` would be added to
externals.



