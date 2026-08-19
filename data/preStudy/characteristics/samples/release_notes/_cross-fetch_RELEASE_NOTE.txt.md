v4.0.0
## What's Changed

BREAKING CHANGES
- Dropped support for Node 10 and 12. (Note: cross-fetch will likely continue working on those versions, but specs tests are not running on those Node versions and no support will be provided if issues come up.)
- Please check implementation conflicts in the [Fetch API tests](https://github.com/lquixada/cross-fetch/blob/v4.x/test/fetch-api/api.spec.ts).

FEATURES
- Added support for Node 18 and 20.
- Added support for Service and Cloudflare Workers (Fixes #69, #78, #148) by prioritizing native code over third-party implementation. Fetch API test suite now running against `node-fetch`, `whatwg-fetch`, native browser and native node fetch.
- Upgraded `whatwg-fetch` to 3.6.2. Please refer to `whatwg-fetch` [release notes](https://github.com/github/fetch/releases) between 3.0.0 and 3.6.2 for features and bug fixes.
- `fetch.ponyfill` is set to `true` when custom implementation is used. This improves debuggability.