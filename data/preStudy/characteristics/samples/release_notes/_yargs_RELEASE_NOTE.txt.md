v17.0.0


### ⚠ BREAKING CHANGES

* **node:** drop Node 10 (#1919)
* implicitly private methods are now actually private
* deprecated reset() method is now private (call yargs() instead).
* **yargs-factory:** refactor yargs-factory to use class (#1895)
* .positional() now allowed at root level of yargs.
* **coerce:** coerce is now applied before validation.
* **async:** yargs now returns a promise if async or check are asynchronous.
* **middleware:** global middleware now applied when no command is configured.
* #1823 contains the following breaking API changes:
    * now returns a promise if handler is async.
    * onFinishCommand removed, in favor of being able to await promise.
    * getCompletion now invokes callback with err and `completions, returns promise of completions.

### Features

* add commands alias (similar to options function) ([#1850](https://www.github.com/yargs/yargs/issues/1850)) ([00b74ad](https://www.github.com/yargs/yargs/commit/00b74adcb30ab89b4450ef7105ef1ad32d820ebf))
* add parseSync/parseAsync method ([#1898](https://www.github.com/yargs/yargs/issues/1898)) ([6130ad8](https://www.github.com/yargs/yargs/commit/6130ad89b85dc49e34190e596e14a2fd3e668781))
* add support for `showVersion`, similar to `showHelp` ([#1831](https://www.github.com/yargs/yargs/issues/1831)) ([1a1e2d5](https://www.github.com/yargs/yargs/commit/1a1e2d554dca3566bc174584394419be0120d207))
* adds support for async builder ([#1888](https://www.github.com/yargs/yargs/issues/1888)) ([ade29b8](https://www.github.com/yargs/yargs/commit/ade29b864abecaa8c4f8dcc3493f5eb24fb73d84)), closes [#1042](https://www.github.com/yargs/yargs/issues/1042)
* allow calling standard completion function from custom one ([#1855](https://www.github.com/yargs/yargs/issues/1855)) ([31765cb](https://www.github.com/yargs/yargs/commit/31765cbdce812ee5c16aaae70ab523a2c7e0fcec))
* allow default completion to be referenced and modified, in custom completion ([#1878](https://www.github.com/yargs/yargs/issues/1878)) ([01619f6](https://www.github.com/yargs/yargs/commit/01619f6191a3ab16bf6b77456d4e9dfa80533907))
* **async:** add support for async check and coerce ([#1872](https://www.github.com/yargs/yargs/issues/1872)) ([8b95f57](https://www.github.com/yargs/yargs/commit/8b95f57bb2a49b098c6bf23cea88c6f900a34f89))
* improve support for async/await ([#1823](https://www.github.com/yargs/yargs/issues/1823)) ([169b815](https://www.github.com/yargs/yargs/commit/169b815df7ae190965f04030f28adc3ab92bb4b5))
* **locale:** add Ukrainian locale ([#1893](https://www.github.com/yargs/yargs/issues/1893)) ([c872dfc](https://www.github.com/yargs/yargs/commit/c872dfc1d87ebaa7fcc79801f649318a16195495))
* **middleware:** async middleware can now be used before validation. ([e0f9363](https://www.github.com/yargs/yargs/commit/e0f93636e04fa7e02a2c3b1fe465b6a14aa1f06d))
* **middleware:** global middleware now applied when no command is configured. ([e0f9363](https://www.github.com/yargs/yargs/commit/e0f93636e04fa7e02a2c3b1fe465b6a14aa1f06d))
* **node:** drop Node 10 ([#1919](https://www.github.com/yargs/yargs/issues/1919)) ([5edeb9e](https://www.github.com/yargs/yargs/commit/5edeb9ea17b1f0190a3590508f2e7911b5f70659))


### Bug Fixes

* always cache help message when running commands ([#1865](https://www.github.com/yargs/yargs/issues/1865)) ([d57ca77](https://www.github.com/yargs/yargs/commit/d57ca7751d533d7e0f216cd9fbf7c2b0ec98f791)), closes [#1853](https://www.github.com/yargs/yargs/issues/1853)
* **async:** don't call parse callback until async ops complete ([#1896](https://www.github.com/yargs/yargs/issues/1896)) ([a93f5ff](https://www.github.com/yargs/yargs/commit/a93f5ff35d7c09b01e0ca93d7d855d2b26593165)), closes [#1888](https://www.github.com/yargs/yargs/issues/1888)
* **builder:** apply default builder for showHelp/getHelp ([#1913](https://www.github.com/yargs/yargs/issues/1913)) ([395bb67](https://www.github.com/yargs/yargs/commit/395bb67749787d269cabe80ffc3133c2f6958aeb)), closes [#1912](https://www.github.com/yargs/yargs/issues/1912)
* **builder:** nested builder is now awaited ([#1925](https://www.github.com/yargs/yargs/issues/1925)) ([b5accd6](https://www.github.com/yargs/yargs/commit/b5accd64ccbd3ffb800517fb40d0f59382515fbb))
* **coerce:** options using coerce now displayed in help ([#1911](https://www.github.com/yargs/yargs/issues/1911)) ([d2128cc](https://www.github.com/yargs/yargs/commit/d2128cc4ffd411eed7111e6a3c561948330e4f6f)), closes [#1909](https://www.github.com/yargs/yargs/issues/1909)
* completion script name clashing on bash ([#1903](https://www.github.com/yargs/yargs/issues/1903)) ([8f62d9a](https://www.github.com/yargs/yargs/commit/8f62d9a9e8bebf86f988c100ad3c417dc32b2471))
* **deno:** use actual names for keys instead of inferring ([#1891](https://www.github.com/yargs/yargs/issues/1891)) ([b96ef01](https://www.github.com/yargs/yargs/commit/b96ef01b16bc5377b79d7914dd5495068037fe7b))
* exclude positionals from default completion ([#1881](https://www.github.com/yargs/yargs/issues/1881)) ([0175677](https://www.github.com/yargs/yargs/commit/0175677b79ffe50a9c5477631288ae10120b8a32))
* https://github.com/yargs/yargs/issues/1841#issuecomment-804770453 ([b96ef01](https://www.github.com/yargs/yargs/commit/b96ef01b16bc5377b79d7914dd5495068037fe7b))
* showHelp() and .getHelp() now return same output for commands as --help ([#1826](https://www.github.com/yargs/yargs/issues/1826)) ([36abf26](https://www.github.com/yargs/yargs/commit/36abf26919b5a19f3adec08598539851c34b7086))
* zsh completion is now autoloadable ([#1856](https://www.github.com/yargs/yargs/issues/1856)) ([d731f9f](https://www.github.com/yargs/yargs/commit/d731f9f9adbc11f918e918443c5bff4149fc6681))


### Code Refactoring

* **coerce:** coerce is now applied before validation. ([8b95f57](https://www.github.com/yargs/yargs/commit/8b95f57bb2a49b098c6bf23cea88c6f900a34f89))
* deprecated reset() method is now private (call yargs() instead). ([376f892](https://www.github.com/yargs/yargs/commit/376f89242733dcd4ecb8040685c40ae1d622931d))
* implicitly private methods are now actually private ([376f892](https://www.github.com/yargs/yargs/commit/376f89242733dcd4ecb8040685c40ae1d622931d))
* **yargs-factory:** refactor yargs-factory to use class ([#1895](https://www.github.com/yargs/yargs/issues/1895)) ([376f892](https://www.github.com/yargs/yargs/commit/376f89242733dcd4ecb8040685c40ae1d622931d))
