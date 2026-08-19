v5.0.0:
semver major release to pull changes since the last release. the main motivations for the release are:
- drop the support for node.js v12.x.
- marked methods of wrapper classes `const`.
- enabled wrapping `napi` namespace with custom namespace.
- added an override to `napi::function::call` to call it with a c-style array
of `napi::value`'s.
- improved the test framework. added the possibility to run subsets of tests
more easily.
- added test for `napi::asynccontext` class.
- fixed ramdom failure on test for `napi::threadsafefunction` e 
`napi::typedthreadsafefunction` class.
- fixed compilation problem on debian 8 system.
- added test for `napi::object::set()` method.
- added some clarifications for `napi::classpropertydescriptor`.
- added clarification about weak reference for `napi::objectwrap`.
- some minor fixes all over the documentation.
- fixed `eslint` configuration.
- fixed ci configuration for windows.
- enabled pre-commit `clangformat` on windows.
## what's changed
* testing ci run by @jckxia in https://github.com/nodejs/node-addon-api/pull/1132
* add test case for object set using uint32 as key by @meixg in https://github.com/nodejs/node-addon-api/pull/1130
* src: do not use non-static class member for constant value by @addaleax in https://github.com/nodejs/node-addon-api/pull/1134
* add function::call napi::value override by @rgerd in https://github.com/nodejs/node-addon-api/pull/1026
* src: enable wrapping napi namespace with custom namespace by @addaleax in https://github.com/nodejs/node-addon-api/pull/1135
* doc: mention napi::env arg for finalization callbacks by @extremeheat in https://github.com/nodejs/node-addon-api/pull/1139
* lint: set sourcetype to 'script' by @addaleax in https://github.com/nodejs/node-addon-api/pull/1141
* build: run windows ci only on nondeprecated build configurations by @raisinten in https://github.com/nodejs/node-addon-api/pull/1152
* doc: clarify objectwrap weak ref behavior by @mildsunrise in https://github.com/nodejs/node-addon-api/pull/1155
* doc: added some comments to classpropertydescriptor. by @nicknaso in https://github.com/nodejs/node-addon-api/pull/1149
* add test coverage for async contexts by @jckxia in https://github.com/nodejs/node-addon-api/pull/1164

## new contributors
* @meixg made their first contribution in https://github.com/nodejs/node-addon-api/pull/1130
* @rgerd made their first contribution in https://github.com/nodejs/node-addon-api/pull/1026
* @extremeheat made their first contribution in https://github.com/nodejs/node-addon-api/pull/1139

**full changelog**: https://github.com/nodejs/node-addon-api/compare/v4.3.0...v5.0.0