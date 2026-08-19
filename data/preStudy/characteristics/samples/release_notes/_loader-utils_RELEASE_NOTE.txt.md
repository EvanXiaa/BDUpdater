v3.0.0
## [3.0.0](https://github.com/webpack/loader-utils/compare/v2.0.0...v3.0.0) (2021-10-20)


### ⚠ BREAKING CHANGES

* minimum supported Node.js version is `12.13.0` ([93a87ce](https://github.com/webpack/loader-utils/commit/93a87cefd41cc69de0bc1f9099f7d753ed8cd557))
* use `xxhash64` by default for `[hash]`/`[contenthash]` and `getHashDigest` API
* `[emoji]` was removed without replacements, please use custom function if you need this
* removed `getOptions` in favor `loaderContext.getOptions` (`loaderContext` is `this` inside loader function), note - special query parameters like `?something=true` is not supported anymore, if you need this please do it on `loader` side, but we strongly recommend avoid it, as alternative you can use `?something=1` and handle `1` as `true`
* removed `getRemainingRequest` in favor `loaderContext.remainingRequest` (`loaderContext` is `this` inside loader function)
* removed `getCurrentRequest` in favor `loaderContext.currentRequest` (`loaderContext` is `this` inside loader function)
* removed `parseString` in favor `JSON.parse`
* removed `parseQuery` in favor `new URLSearchParams(loaderContext.resourceQuery.slice(1))` where `loaderContext` is `this` in loader function
* removed `stringifyRequest` in favor `JSON.stringify(loaderContext.utils.contextify(this.context, request))` (`loaderContext` is `this` inside loader function), also it will be cachable and faster
* `isUrlRequest` ignores only absolute URLs and `#hash` requests, `data URI` and root relative request are handled as requestable due webpack v5 support them

### Bug Fixes

* allowed the `interpolateName` API works without options ([862ea7d](https://github.com/webpack/loader-utils/commit/862ea7d1d0226558f2750bec36da02492d1e516d))
