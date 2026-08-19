v6.0.0
# [6.0.0](https://github.com/karma-runner/karma/compare/v5.2.3...v6.0.0) (2021-01-13)


### Bug Fixes

* **ci:** abandon browserstack tests for Safari and IE ([#3615](https://github.com/karma-runner/karma/issues/3615)) ([04a811d](https://github.com/karma-runner/karma/commit/04a811dc7a4b37aa56c0405880f03cb2493bf820))
* **client:** do not reset karmaNavigating in unload handler ([#3591](https://github.com/karma-runner/karma/issues/3591)) ([4a8178f](https://github.com/karma-runner/karma/commit/4a8178f3a0504ef007b23ef0fd8f5ca128f0c5c6)), closes [#3482](https://github.com/karma-runner/karma/issues/3482)
* **context:** do not error when karma is navigating ([#3565](https://github.com/karma-runner/karma/issues/3565)) ([05dc288](https://github.com/karma-runner/karma/commit/05dc28801627e3ce7054ae548046714dc2cf7a5e)), closes [#3560](https://github.com/karma-runner/karma/issues/3560)
* **cve:** update ua-parser-js to 0.7.23 to fix CVE-2020-7793 ([#3584](https://github.com/karma-runner/karma/issues/3584)) ([f819fa8](https://github.com/karma-runner/karma/commit/f819fa843fa0633edbe2af6ac2889e25ea2cb639))
* **cve:** update yargs to 16.1.1 to fix cve-2020-7774 in y18n ([#3578](https://github.com/karma-runner/karma/issues/3578)) ([3fed0bc](https://github.com/karma-runner/karma/commit/3fed0bc7dd042a09c8aec55c059654781a4584ec)), closes [#3577](https://github.com/karma-runner/karma/issues/3577)
* **deps:** bump socket-io to v3 ([#3586](https://github.com/karma-runner/karma/issues/3586)) ([1b9e1de](https://github.com/karma-runner/karma/commit/1b9e1de7d081e1c205debff27c6b5e1fe0585dee)), closes [#3569](https://github.com/karma-runner/karma/issues/3569)
* **middleware:** catch errors when loading a module ([#3605](https://github.com/karma-runner/karma/issues/3605)) ([fec972f](https://github.com/karma-runner/karma/commit/fec972ff63760f9606a4cef7673a68c55c880722)), closes [#3572](https://github.com/karma-runner/karma/issues/3572)
* **server:** clean up close-server logic ([#3607](https://github.com/karma-runner/karma/issues/3607)) ([3fca456](https://github.com/karma-runner/karma/commit/3fca456a02a65304d6423d6311fb55f83e73d85e))
* **test:** clear up clearContext ([#3597](https://github.com/karma-runner/karma/issues/3597)) ([8997b74](https://github.com/karma-runner/karma/commit/8997b7465de3c5f7e436078b57acae98de1ce39a))
* **test:** mark all second connections reconnects ([#3598](https://github.com/karma-runner/karma/issues/3598)) ([1c9c2de](https://github.com/karma-runner/karma/commit/1c9c2de54fa1abcb2c0edceebb159440b77e4863))


### Features

* **cli:** error out on unexpected options or parameters ([#3589](https://github.com/karma-runner/karma/issues/3589)) ([603bbc0](https://github.com/karma-runner/karma/commit/603bbc0db2ef4e6b8474f97a8255587f2a5f924e))
* **client:** update banner with connection, test status, ping times ([#3611](https://github.com/karma-runner/karma/issues/3611)) ([4bf90f7](https://github.com/karma-runner/karma/commit/4bf90f70f46cddf52a55d8f2b9ce0ccd2d4a4d3b))
* **server:** print stack of unhandledrejections ([#3593](https://github.com/karma-runner/karma/issues/3593)) ([35a5842](https://github.com/karma-runner/karma/commit/35a584234b00297dc511300bb6e42eeaceac8345))
* **server:** remove deprecated static methods ([#3595](https://github.com/karma-runner/karma/issues/3595)) ([1a65bf1](https://github.com/karma-runner/karma/commit/1a65bf1181bc9eb5c28ba0130ab7d90e89b21918))
* remove support for running dart code in the browser ([#3592](https://github.com/karma-runner/karma/issues/3592)) ([7a3bd55](https://github.com/karma-runner/karma/commit/7a3bd5545fa1307c754419252fa35ff0b7572ae4))


### BREAKING CHANGES

* **server:** Deprecated `require('karma').server.start()` and `require('karma').Server.start()` variants were removed from the public API. Instead use canonical form:

```
const { Server } = require('karma');
const server = new Server();
server.start();
```
* **cli:** Karma is more strict and will error out if unknown option or argument is passed to CLI.
* Using Karma to run Dart code in the browser is no longer supported. Use your favorite Dart-to-JS compiler instead.

`dart` file type has been removed without a replacement.

customFileHandlers` DI token has been removed. Use [`middleware`](http://karma-runner.github.io/5.2/config/configuration-file.html#middleware) to achieve similar functionality.

`customScriptTypes` DI token has been removed. It had no effect, so no replacement is provided.
* **deps:** Some projects have socket.io tests that are version sensitive.



