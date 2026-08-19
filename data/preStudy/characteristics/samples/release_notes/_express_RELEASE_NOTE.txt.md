v5.0.0:
# express v5.0.0 

🎉 **express v5 is finally here!** 🎉

after years of development, the long-awaited express v5 has been officially released. this version focuses on simplifying the codebase, improving security, and dropping support for older node.js versions to enable better performance and maintainability.

for detailed information, please check out the official [express v5 release blog post](https://expressjs.com/2024/10/15/v5-release.html).

## most relevant details

### major changes in v5

- **node.js version support**: dropped support for node.js versions before v18.
- **routing changes**: updated to `path-to-regexp@8.x`, removing sub-expression regex patterns for security reasons (redos mitigation).
- **promise support**: middleware can now return rejected promises, caught by the router as errors.
- **`body-parser` changes**: several improvements including the ability to customize `urlencoded` body depth and defaulting `extended` to `false`.
- **deprecated api methods removed**: removed old, deprecated api method signatures from express v3/v4.

for a complete list of breaking changes and api deprecations, see the [migration guide](https://expressjs.com/en/guide/migrating-5.html).

### security updates

this release includes important security fixes, including improvements to prevent redos attacks and mitigation for cve-2024-45590. full details can be found in the [security release notes](https://expressjs.com/2024/09/29/security-releases.html).

### migration

be sure to check out our [migration guide](https://expressjs.com/en/guide/migrating-5.html) for instructions on how to update your applications from express v4 to v5.

### security guidance

for best practices, we recommend reviewing the [threat model](https://github.com/expressjs/security-wg/blob/main/docs/threatmodel.md) which outlines express' approach to securing your applications, including tips for user input validation and other critical aspects.


## what's changed
* 4.19.2 staging by @wesleytodd in https://github.com/expressjs/express/pull/5561
* remove duplicate location test for data uri by @wesleytodd in https://github.com/expressjs/express/pull/5562
* feat: document beta releases expectations by @marco-ippolito in https://github.com/expressjs/express/pull/5565
* cut down on duplicated ci runs by @jonchurch in https://github.com/expressjs/express/pull/5564
* add a threat model by @ulisesgascon in https://github.com/expressjs/express/pull/5526
* assign captain of encodeurl by @blakeembrey in https://github.com/expressjs/express/pull/5579
* nominate jonchurch as repo captain for `http-errors`, `expressjs.com`, `morgan`, `cors`, `body-parser` by @jonchurch in https://github.com/expressjs/express/pull/5587
* docs: update security.md by @inigomarquinez in https://github.com/expressjs/express/pull/5590
* docs: update triage nomination policy by @ulisesgascon in https://github.com/expressjs/express/pull/5600
* add codeql (sast) by @ulisesgascon in https://github.com/expressjs/express/pull/5433
* docs: add ulisesgascon as triage initiative captain by @ulisesgascon in https://github.com/expressjs/express/pull/5605
* use object with null prototype for various app properties by @evanhahn in https://github.com/expressjs/express/pull/4861
* deps: encodeurl@~2.0.0 by @blakeembrey in https://github.com/expressjs/express/pull/5569
* skip query method test by @jonchurch in https://github.com/expressjs/express/pull/5628
* ignore etag query test on 21 and 22, reuse skip util by @jonchurch in https://github.com/expressjs/express/pull/5639
* add support node.js@22 in the ci by @mertcanaltin in https://github.com/expressjs/express/pull/5627
* doc: add table of contents, tc/triager lists to readme by @mertcanaltin in https://github.com/expressjs/express/pull/5619
* list and sort all projects, add captains by @blakeembrey in https://github.com/expressjs/express/pull/5653
* call callback once on listen error by @wesleytodd in https://github.com/expressjs/express/pull/3216
* docs: add @ulisesgascon as captain for cookie-parser by @ulisesgascon in https://github.com/expressjs/express/pull/5666
* ✨ bring back query tests for node 21 by @ctcpip in https://github.com/expressjs/express/pull/5690
* [v4] deprecate `res.clearcookie` accepting `options.maxage` and `options.expires` by @jonchurch in https://github.com/expressjs/express/pull/5672
* skip query tests for node 21 only, still not supported by @jonchurch in https://github.com/expressjs/express/pull/5695
* 📝 update people, add ctcpip to tc by @ctcpip in https://github.com/expressjs/express/pull/5683
* remove minor version pinning from ci by @jonchurch in https://github.com/expressjs/express/pull/5722
* fix link variable use in attribution section of code of conduct by @iamlizu in https://github.com/expressjs/express/pull/5762
* replace appveyor windows testing with gha by @jonchurch in https://github.com/expressjs/express/pull/5599
* add ossf scorecard badge by @ulisesgascon in https://github.com/expressjs/express/pull/5436
* throw on invalid status codes by @jonchurch in https://github.com/expressjs/express/pull/4212
* use array.flat instead of array-flatten by @almic in https://github.com/expressjs/express/pull/5677
* adopt node@18 as the minimum supported version by @ulisesgascon in https://github.com/expressjs/express/pull/5803
* ignore `expires` and `maxage` in `res.clearcookie()` by @jonchurch in https://github.com/expressjs/express/pull/5792
* send@1.0.0 by @wesleytodd in https://github.com/expressjs/express/pull/5786
* chore: upgrade `debug` dep from 3.10 to 4.3.6 by @carpasse in https://github.com/expressjs/express/pull/5829
* refactor: replace 'path-is-absolute' dep with node:path isabsolute method by @carpasse in https://github.com/expressjs/express/pull/5830
* update scorecard link by @bjohansebas in https://github.com/expressjs/express/pull/5814
* nominate @iamlizu to the triage team by @ulisesgascon in https://github.com/expressjs/express/pull/5836
* deps: path-to-regexp@0.1.8 by @blakeembrey in https://github.com/expressjs/express/pull/5603
* docs: specify new instructions for `question` and `discuss` by @iamlizu in https://github.com/expressjs/express/pull/5835
* 5.x: upgrading `merge-descriptors` with allowing minors by @robintail in https://github.com/expressjs/express/pull/5782
* 4.x: upgrade `merge-descriptors` dependency by @robintail in https://github.com/expressjs/express/pull/5781
* wip: serve-static@2 by @wesleytodd in https://github.com/expressjs/express/pull/5790
* chore: upgrade qs dp from 6.11.0 to 6.13.0 by @carpasse in https://github.com/expressjs/express/pull/5847
* upgrade cookie signature by @iamlizu in https://github.com/expressjs/express/pull/5833
* accepts@2 by @wesleytodd in https://github.com/expressjs/express/pull/5881
* mime-types@3 by @wesleytodd in https://github.com/expressjs/express/pull/5882
* type-is@^2.0.0 by @wesleytodd in https://github.com/expressjs/express/pull/5883
* content-disposition@^1.0.0 by @wesleytodd in https://github.com/expressjs/express/pull/5884
* fix(deps): finalhandler@^2.0.0 by @wesleytodd in https://github.com/expressjs/express/pull/5899
* path-to-regexp@0.1.10 by @blakeembrey in https://github.com/expressjs/express/pull/5902
* update to `fresh@^2.0.0` by @jonchurch in https://github.com/expressjs/express/pull/5916
* router@^2.0.0 by @wesleytodd in https://github.com/expressjs/express/pull/5885
* adopt node@18 as the minimum supported version by @ulisesgascon in https://github.com/expressjs/express/pull/5595
* master -> 5.0 by @ctcpip in https://github.com/expressjs/express/pull/5785
* 🔧 update ci, remove unsupported versions, clean up by @ctcpip in https://github.com/expressjs/express/pull/5931
* delete `back` as a magic string by @blakeembrey in https://github.com/expressjs/express/pull/5933
* release 5.0 by @dougwilson in https://github.com/expressjs/express/pull/2237

## new contributors
* @marco-ippolito made their first contribution in https://github.com/expressjs/express/pull/5565
* @inigomarquinez made their first contribution in https://github.com/expressjs/express/pull/5590
* @mertcanaltin made their first contribution in https://github.com/expressjs/express/pull/5627
* @ctcpip made their first contribution in https://github.com/expressjs/express/pull/5690
* @iamlizu made their first contribution in https://github.com/expressjs/express/pull/5762
* @almic made their first contribution in https://github.com/expressjs/express/pull/5677
* @carpasse made their first contribution in https://github.com/expressjs/express/pull/5829
* @bjohansebas made their first contribution in https://github.com/expressjs/express/pull/5814
* @robintail made their first contribution in https://github.com/expressjs/express/pull/5782

**full changelog**: https://github.com/expressjs/express/compare/v5.0.0-beta.3...v5.0.0
