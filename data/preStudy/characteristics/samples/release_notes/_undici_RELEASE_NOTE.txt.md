v7.0.0-alpha.2
## What's Changed
* fetch: fix content-encoding order by @tsctx in https://github.com/nodejs/undici/pull/3343
* Add regression test for broken body by @mcollina in https://github.com/nodejs/undici/pull/3346
* build(deps): bump node from `075a5cc` to `9af472b` in /build by @dependabot in https://github.com/nodejs/undici/pull/3355
* fix: post request signal by @Gigioliva in https://github.com/nodejs/undici/pull/3354
* Revert "fix: post request signal (#3354)" by @ronag in https://github.com/nodejs/undici/pull/3359
* websocket: don't use pooled buffer in mask pool by @tsctx in https://github.com/nodejs/undici/pull/3357
* fix: consider bytes read when dumping by @ronag in https://github.com/nodejs/undici/pull/3360
* refactor: simplify signal handling by @ronag in https://github.com/nodejs/undici/pull/3362
* fix: use explicit flag for when use has interacted with stream by @ronag in https://github.com/nodejs/undici/pull/3361
* Refactor example documentation structure and add CacheableLookup example by @DarkGL in https://github.com/nodejs/undici/pull/3363
* refactor: simplify request error handling by @ronag in https://github.com/nodejs/undici/pull/3364
* fix: ensure onConnect is always called by @ronag in https://github.com/nodejs/undici/pull/3327
* Refactor responseHeader to responseHeaders by @DarkGL in https://github.com/nodejs/undici/pull/3375
* fix: don't override user defined MaxListeners by @fawazahmed0 in https://github.com/nodejs/undici/pull/3372
* fix: forward dispatch return value by @ronag in https://github.com/nodejs/undici/pull/3368
* build(deps): bump github/codeql-action from 3.25.7 to 3.25.11 by @dependabot in https://github.com/nodejs/undici/pull/3382
* build(deps): bump codecov/codecov-action from 4.4.1 to 4.5.0 by @dependabot in https://github.com/nodejs/undici/pull/3384
* build(deps): bump actions/dependency-review-action from 4.3.2 to 4.3.3 by @dependabot in https://github.com/nodejs/undici/pull/3383
* build(deps): bump step-security/harden-runner from 2.8.0 to 2.8.1 by @dependabot in https://github.com/nodejs/undici/pull/3381
* fix: throw on retry when payload is consume by downstream by @climba03003 in https://github.com/nodejs/undici/pull/3389
* Remove file by @KhafraDev in https://github.com/nodejs/undici/pull/3367
* build(deps): bump node from `9af472b` to `138d0b5` in /build by @dependabot in https://github.com/nodejs/undici/pull/3392
* feat!: upgrade llhttp to 9.2.0 (#2705) by @metcoder95 in https://github.com/nodejs/undici/pull/3388
* websocket: reduce memory usage by @tsctx in https://github.com/nodejs/undici/pull/3393
* feat: implement `BodyReadable.bytes` by @tsctx in https://github.com/nodejs/undici/pull/3391
* websocket: avoid using Buffer.byteLength by @tsctx in https://github.com/nodejs/undici/pull/3394
* separate whatwg websocket logic from rfc 6455 by @KhafraDev in https://github.com/nodejs/undici/pull/3396
* websocket: add fast-path for string input by @tsctx in https://github.com/nodejs/undici/pull/3395
* Add generic type for opaque object by @jfhr in https://github.com/nodejs/undici/pull/3385
* build(deps): bump node from `138d0b5` to `67225d4` in /build by @dependabot in https://github.com/nodejs/undici/pull/3398
* interceptors: move throwOnError to interceptor by @mertcanaltin in https://github.com/nodejs/undici/pull/3331
* chore!: drop interceptors by @metcoder95 in https://github.com/nodejs/undici/pull/3399
* build(deps-dev): bump @fastify/busboy from 2.1.1 to 3.0.0 by @dependabot in https://github.com/nodejs/undici/pull/3404
* fix: don't call onConnect automatically by @ronag in https://github.com/nodejs/undici/pull/3407
* In CITGM, skip tests that are flaky there by @mcollina in https://github.com/nodejs/undici/pull/3413
* Update esbuild to 0.19.10 by @mcollina in https://github.com/nodejs/undici/pull/3415
* Fix signature of RetryHandler by @JbIPS in https://github.com/nodejs/undici/pull/3416
* docs: fix ToC in CONTRIBUTING.md by @richardlau in https://github.com/nodejs/undici/pull/3420
* Fix fetch `duplex` docs by @Ethan-Arrowood in https://github.com/nodejs/undici/pull/3422
* fix: restore externalized Node.js dep compatibility by @richardlau in https://github.com/nodejs/undici/pull/3421
* fix: cast falsy servername to null to avoid falsy inequality by @ronag in https://github.com/nodejs/undici/pull/3426
* Add backport action by @mcollina in https://github.com/nodejs/undici/pull/3427
* build(deps): bump node from `67225d4` to `858234a` in /build by @dependabot in https://github.com/nodejs/undici/pull/3411
* build(deps): bump github/codeql-action from 3.25.11 to 3.25.15 by @dependabot in https://github.com/nodejs/undici/pull/3432
* build(deps): bump actions/dependency-review-action from 4.3.3 to 4.3.4 by @dependabot in https://github.com/nodejs/undici/pull/3431
* build(deps): bump actions/upload-artifact from 4.3.3 to 4.3.4 by @dependabot in https://github.com/nodejs/undici/pull/3430
* build(deps): bump ossf/scorecard-action from 2.3.3 to 2.4.0 by @dependabot in https://github.com/nodejs/undici/pull/3428
* build(deps): bump step-security/harden-runner from 2.8.1 to 2.9.0 by @dependabot in https://github.com/nodejs/undici/pull/3429
* build(deps): bump superagent from 9.0.2 to 10.0.0 in /benchmarks by @dependabot in https://github.com/nodejs/undici/pull/3439
* build(deps): bump node from `17e6738` to `30c5be9` in /build by @dependabot in https://github.com/nodejs/undici/pull/3443
* docs: use default link of Web Streams API by @trivikr in https://github.com/nodejs/undici/pull/3446
* fix: increased memory in finalization first appearing in v6.16.0 by @snyamathi in https://github.com/nodejs/undici/pull/3445
* test: add test for memory leak by @snyamathi in https://github.com/nodejs/undici/pull/3450
* build: parametrize the location of wasm-opt by @khardix in https://github.com/nodejs/undici/pull/3454
* test: streamline test scripts in regard of without-intl and run more tests for without-intl case by @Uzlopak in https://github.com/nodejs/undici/pull/3453
* feat!: drop throwOnError by @metcoder95 in https://github.com/nodejs/undici/pull/3451
* types: allow non strict HTTPMethod by @Uzlopak in https://github.com/nodejs/undici/pull/3457
* build(deps-dev): bump borp from 0.15.0 to 0.17.0 by @dependabot in https://github.com/nodejs/undici/pull/3424
* remove core isErrored and isReadable by @KhafraDev in https://github.com/nodejs/undici/pull/3459
* use bodyUnusable to check if body is unusable by @KhafraDev in https://github.com/nodejs/undici/pull/3460
* perf: non-recursive implementation of euclidian gcd in balanced pool by @Uzlopak in https://github.com/nodejs/undici/pull/3461
* fix: do validation first before actual business logic, like super() by @Uzlopak in https://github.com/nodejs/undici/pull/3463
* use FinalizationRegistry for cloned response body by @KhafraDev in https://github.com/nodejs/undici/pull/3458
* perf: use isIPv6 for checking if hostname is isIPv6 by @Uzlopak in https://github.com/nodejs/undici/pull/3466
* fix: stripURLForReferrer jsdoc in fetch logic by @Uzlopak in https://github.com/nodejs/undici/pull/3471
* fix: remove kInterceptors in ProxyAgent by @Uzlopak in https://github.com/nodejs/undici/pull/3474
* fix: fix codesmells in retry-handler by @Uzlopak in https://github.com/nodejs/undici/pull/3475
* add autocompletable header types by @KhafraDev in https://github.com/nodejs/undici/pull/3462
* fix: add missing kOriginalDispatch Symbol in mock-logic by @Uzlopak in https://github.com/nodejs/undici/pull/3470
* fix: fix jsdoc in cookies/parse.js by @Uzlopak in https://github.com/nodejs/undici/pull/3469
* fix: remove unnecessary parameters in USVString calls by @Uzlopak in https://github.com/nodejs/undici/pull/3467
* fix: add jsdoc in tree.js, avoiding codesmells by @Uzlopak in https://github.com/nodejs/undici/pull/3476
* perf: set isLowerCase param on all calls of HeadersList.append by @Uzlopak in https://github.com/nodejs/undici/pull/3468
* fix: instantiation of ResponseError, pass headers and data correctly by @Uzlopak in https://github.com/nodejs/undici/pull/3472
* ci: add WPT updater by @Uzlopak in https://github.com/nodejs/undici/pull/3482
* meta: move nightly comment body to issue body by @RedYetiDev in https://github.com/nodejs/undici/pull/3484
* chore: improve jsdoc in cookies by @Uzlopak in https://github.com/nodejs/undici/pull/3478
* chore: improve jsdoc and minor changes in EventSource by @Uzlopak in https://github.com/nodejs/undici/pull/3480
* types: add Autocomplete utility type by @Uzlopak in https://github.com/nodejs/undici/pull/3479
* fix: instantiation of SecureProxyConnectionError should pass options to parent class by @Uzlopak in https://github.com/nodejs/undici/pull/3473
* chore: replace standard and snazzy with neostandard by @Uzlopak in https://github.com/nodejs/undici/pull/3485
* fix: workflow commit user by @tsctx in https://github.com/nodejs/undici/pull/3491
* build(deps): bump node from `30c5be9` to `a20e858` in /build by @dependabot in https://github.com/nodejs/undici/pull/3496
* chore: add --noEmit for typescript tests by @Uzlopak in https://github.com/nodejs/undici/pull/3498
* perf: only create wasm buffer if requested by @Uzlopak in https://github.com/nodejs/undici/pull/3499
* fix(types): MockAgent accepts ProxyAgent, EnvHttpProxyAgent and RetryAgent for agent option by @Uzlopak in https://github.com/nodejs/undici/pull/3497
* stricter Headers brand checks in cookies by @KhafraDev in https://github.com/nodejs/undici/pull/3500
* Update WPT by @github-actions in https://github.com/nodejs/undici/pull/3488
* fix: setEncoding should not throw on body #1125 by @Uzlopak in https://github.com/nodejs/undici/pull/3505
* websocket: set websocket readyState on fail by @KhafraDev in https://github.com/nodejs/undici/pull/3507
* build(deps-dev): bump jsdom from 24.1.3 to 25.0.0 by @dependabot in https://github.com/nodejs/undici/pull/3511
* build(deps): bump wait-on from 7.2.0 to 8.0.0 in /benchmarks by @dependabot in https://github.com/nodejs/undici/pull/3513
* Update WPT by @github-actions in https://github.com/nodejs/undici/pull/3515
* fix: reduce memory usage in client-h1 by @Uzlopak in https://github.com/nodejs/undici/pull/3510
* fix: refactor fast timers, fix UND_ERR_CONNECT_TIMEOUT on event loop blocking by @Uzlopak in https://github.com/nodejs/undici/pull/3495
* ci: make autobahn workflow reusable workflow, run the autobahn on nightly tests by @Uzlopak in https://github.com/nodejs/undici/pull/3503
* remove third party everything support in fetch by @KhafraDev in https://github.com/nodejs/undici/pull/3502
* remove double validation in webidl by @KhafraDev in https://github.com/nodejs/undici/pull/3516
* test: improve gc detection by @Uzlopak in https://github.com/nodejs/undici/pull/3504
* Update WPT by @github-actions in https://github.com/nodejs/undici/pull/3519
* populate defaultValues in webidl dict. converter when passing null or undefined by @KhafraDev in https://github.com/nodejs/undici/pull/3518
* change webidl.util.Type return to an enum value by @KhafraDev in https://github.com/nodejs/undici/pull/3520
* set default argument values to undefined instead of {} by @KhafraDev in https://github.com/nodejs/undici/pull/3521
* ci: fix nightly workflow by @Uzlopak in https://github.com/nodejs/undici/pull/3525
* Update WPT by @github-actions in https://github.com/nodejs/undici/pull/3527
* remove unused symbol by @KhafraDev in https://github.com/nodejs/undici/pull/3530
* fix formdata arg validation by @KhafraDev in https://github.com/nodejs/undici/pull/3529
* build(deps): bump github/codeql-action from 3.25.15 to 3.26.6 by @dependabot in https://github.com/nodejs/undici/pull/3534
* build(deps): bump hendrikmuhs/ccache-action from 1.2.13 to 1.2.14 by @dependabot in https://github.com/nodejs/undici/pull/3536
* build(deps): bump step-security/harden-runner from 2.9.0 to 2.9.1 by @dependabot in https://github.com/nodejs/undici/pull/3535
* build(deps): bump actions/upload-artifact from 4.3.4 to 4.4.0 by @dependabot in https://github.com/nodejs/undici/pull/3537
* Remove patched DOM types by @eXhumer in https://github.com/nodejs/undici/pull/3533
* chore: minor changes in client-h1, use subarray instead of slice by @Uzlopak in https://github.com/nodejs/undici/pull/3538
* fix: run asserts first if possible by @Uzlopak in https://github.com/nodejs/undici/pull/3541
* build(deps): bump node from `a20e858` to `a17f484` in /build by @dependabot in https://github.com/nodejs/undici/pull/3542
* chore: noop per file by @Uzlopak in https://github.com/nodejs/undici/pull/3544
* build(deps): bump node from `a17f484` to `ef7b4bb` in /build by @dependabot in https://github.com/nodejs/undici/pull/3547
* chore: rename buildUrl to serializePathWithQuery + jsdoc by @Uzlopak in https://github.com/nodejs/undici/pull/3545
* fix: add jsdoc and do minor changes in utils.js by @Uzlopak in https://github.com/nodejs/undici/pull/3550
* Update WPT by @github-actions in https://github.com/nodejs/undici/pull/3556
* Update WPT by @github-actions in https://github.com/nodejs/undici/pull/3561
* feat: jsdoc and minor optimizations in client-h1.js by @Uzlopak in https://github.com/nodejs/undici/pull/3551
* fix: handle websocket closed correctly by @KhafraDev in https://github.com/nodejs/undici/pull/3565
* fix: extract noop everywhere by @Uzlopak in https://github.com/nodejs/undici/pull/3559
* chore: add jsdoc for lib/web/websocket/util.js, minor rewrite of utf8Decode by @Uzlopak in https://github.com/nodejs/undici/pull/3563
* jsdoc: lib/api/readable.js, fix some types by @Uzlopak in https://github.com/nodejs/undici/pull/3567
* fix: use fasttimers for all connection timeouts by @Uzlopak in https://github.com/nodejs/undici/pull/3552
* chore: use 'use strict' in cjs files by @Uzlopak in https://github.com/nodejs/undici/pull/3568
* chore: update typescript testing deps by @Uzlopak in https://github.com/nodejs/undici/pull/3571
* build(deps)!: bump concurrently from 8.2.2 to 9.0.0 in /benchmarks (node < 18 unsupported) by @dependabot in https://github.com/nodejs/undici/pull/3574
* build(deps): bump node from `ef7b4bb` to `3cb4748` in /build by @dependabot in https://github.com/nodejs/undici/pull/3573
* chore: improve jsdoc of lib/core/tree.js by @Uzlopak in https://github.com/nodejs/undici/pull/3572
* Update WPT by @github-actions in https://github.com/nodejs/undici/pull/3576
* jsdoc: improve typing of deepClone by @Uzlopak in https://github.com/nodejs/undici/pull/3575
* chore: improve jsdoc of lib/core/constants.js by @Uzlopak in https://github.com/nodejs/undici/pull/3570
* chore: upgrade fixed queue, lint accordingly, add jsdoc by @Uzlopak in https://github.com/nodejs/undici/pull/3577
* Update WPT by @github-actions in https://github.com/nodejs/undici/pull/3581
* ci: less flaky test/request-timeout.js test by @Uzlopak in https://github.com/nodejs/undici/pull/3580
* chore: remove pluralizer by @Uzlopak in https://github.com/nodejs/undici/pull/3586
* util: rename validateHandler to assertRequestHandler, minor changes in util.js by @Uzlopak in https://github.com/nodejs/undici/pull/3583
* mock: remove Error.captureStackTrace in MockNotMatchedError by @Uzlopak in https://github.com/nodejs/undici/pull/3587
* fix: DRY up lib/core/diagnostics.js by @Uzlopak in https://github.com/nodejs/undici/pull/3585
* fix: husky deprecation warning by @eXhumer in https://github.com/nodejs/undici/pull/3593
* Update WPT by @github-actions in https://github.com/nodejs/undici/pull/3598
* chore: remove unused `pre-commit` dependency by @eXhumer in https://github.com/nodejs/undici/pull/3599
* diagnostics-channel: use not deprecated subscribe fn by @Uzlopak in https://github.com/nodejs/undici/pull/3600
* Update WPT by @github-actions in https://github.com/nodejs/undici/pull/3607
* fetch: make fullyReadBody sync by @Uzlopak in https://github.com/nodejs/undici/pull/3603
* jsdoc: add jsdoc to lib/web/fetch/constants.js by @Uzlopak in https://github.com/nodejs/undici/pull/3597
* fetch: pullAlgorithm passes the async resume function through by @Uzlopak in https://github.com/nodejs/undici/pull/3604
* fix: typo in Client.md by @SkeLLLa in https://github.com/nodejs/undici/pull/3612
* Update WPT by @github-actions in https://github.com/nodejs/undici/pull/3615
* Update WPT by @github-actions in https://github.com/nodejs/undici/pull/3622
* fetch: avoid async function in mainFetch to generate response by @Uzlopak in https://github.com/nodejs/undici/pull/3605
* Update WPT by @github-actions in https://github.com/nodejs/undici/pull/3626
* append crlf to formdata body by @KhafraDev in https://github.com/nodejs/undici/pull/3625
* fix: fire `close` on failed WebSocket connection by @eXhumer in https://github.com/nodejs/undici/pull/3566
* fix: fire close on failed WebSocket connection by @KhafraDev in https://github.com/nodejs/undici/pull/3628
* handle body errors by @KhafraDev in https://github.com/nodejs/undici/pull/3632
* make cloned request inherit dispatcher by @KhafraDev in https://github.com/nodejs/undici/pull/3631
* Remove symbols from web specs by @KhafraDev in https://github.com/nodejs/undici/pull/3633
* cleanup web symbol removal by @KhafraDev in https://github.com/nodejs/undici/pull/3638
* build(deps): bump mitata from 0.1.14 to 1.0.4 in /benchmarks by @dependabot in https://github.com/nodejs/undici/pull/3641
* feat: implement WebSocketStream by @KhafraDev in https://github.com/nodejs/undici/pull/3560
* export WebSocketStream, add docs and types by @KhafraDev in https://github.com/nodejs/undici/pull/3645
* build(deps): bump node from `3cb4748` to `83b4d7b` in /build by @dependabot in https://github.com/nodejs/undici/pull/3621
* feat: add DNS interceptor by @metcoder95 in https://github.com/nodejs/undici/pull/3490
* prefer fail over close the websocket connection in error cases by @KhafraDev in https://github.com/nodejs/undici/pull/3651
* fix: various typos by @NathanBaulch in https://github.com/nodejs/undici/pull/3640
* Update WPT by @github-actions in https://github.com/nodejs/undici/pull/3634
* test: increase bitness in `test/fixtures/*.pem` by @LiviaMedeiros in https://github.com/nodejs/undici/pull/3659
* mock: fix mocking of Uint8Array and ArrayBuffers as provided mock-responses by @Uzlopak in https://github.com/nodejs/undici/pull/3662
* test: less flaky timers acceptance test, rework fast timer tests to pass them faster by @Uzlopak in https://github.com/nodejs/undici/pull/3656
* build(deps): bump github/codeql-action from 3.26.6 to 3.26.10 by @dependabot in https://github.com/nodejs/undici/pull/3664
* build(deps): bump peter-evans/create-pull-request from 6.1.0 to 7.0.5 by @dependabot in https://github.com/nodejs/undici/pull/3665
* build(deps): bump fastify/github-action-merge-dependabot from 3.10.1 to 3.10.2 by @dependabot in https://github.com/nodejs/undici/pull/3667
* build(deps): bump codecov/codecov-action from 4.5.0 to 4.6.0 by @dependabot in https://github.com/nodejs/undici/pull/3668
* ws: move implementation agnostic onFail logic to shared function by @KhafraDev in https://github.com/nodejs/undici/pull/3663
* build(deps): bump step-security/harden-runner from 2.9.1 to 2.10.1 by @dependabot in https://github.com/nodejs/undici/pull/3666
* Update WPT by @github-actions in https://github.com/nodejs/undici/pull/3669
* fix: add option `ignoreTrailingSlash` to MockAgent and `.intercept()`  by @Uzlopak in https://github.com/nodejs/undici/pull/3655
* fix: ignore leading and trailing crlfs in formdata body by @KhafraDev in https://github.com/nodejs/undici/pull/3677
* test: add test to ensure full type when parsing multipart/form-data' by @Uzlopak in https://github.com/nodejs/undici/pull/3683
* test: use globalThis.Headers and skip if is missing by @Uzlopak in https://github.com/nodejs/undici/pull/3684
* jsdoc: adds some jsdoc to fetch headers implementation, minor changes by @Uzlopak in https://github.com/nodejs/undici/pull/3687
* feat: check maxHeadersSize on client instantiation and not on Parser instantion by @Uzlopak in https://github.com/nodejs/undici/pull/3654
* test: remove test for issue 1670 by @Uzlopak in https://github.com/nodejs/undici/pull/3690
* replace instanceof in brand checks with isPrototypeOf by @KhafraDev in https://github.com/nodejs/undici/pull/3692
* test: make fetch test independent from internet connection by @Uzlopak in https://github.com/nodejs/undici/pull/3691
* build(deps-dev): bump esbuild from 0.19.12 to 0.24.0 by @dependabot in https://github.com/nodejs/undici/pull/3698
* fix: restructure determineRequestsReferrer to match better spec by @Uzlopak in https://github.com/nodejs/undici/pull/3699
* set ws readyState if closed before connection could be established by @KhafraDev in https://github.com/nodejs/undici/pull/3701
* types: fix return type of WebidlUtil.Type by @Uzlopak in https://github.com/nodejs/undici/pull/3685

## New Contributors
* @Gigioliva made their first contribution in https://github.com/nodejs/undici/pull/3354
* @fawazahmed0 made their first contribution in https://github.com/nodejs/undici/pull/3372
* @jfhr made their first contribution in https://github.com/nodejs/undici/pull/3385
* @JbIPS made their first contribution in https://github.com/nodejs/undici/pull/3416
* @richardlau made their first contribution in https://github.com/nodejs/undici/pull/3420
* @RedYetiDev made their first contribution in https://github.com/nodejs/undici/pull/3484
* @NathanBaulch made their first contribution in https://github.com/nodejs/undici/pull/3640

**Full Changelog**: https://github.com/nodejs/undici/compare/v6.19.2...v7.0.0-alpha.2