3.0.0-alpha.1:

**if you are a plugin developer, please try this version and send us feedback! feel free to ping @fisker if you have any questions about v3 migration.**

# breaking change since [v3.0.0-alpha.0](https://github.com/prettier/prettier/releases/tag/3.0.0-alpha.0)

* [package file structure updated, `exports` field added to `package.json`](https://github.com/prettier/prettier/blob/008b371e3ed64d31b85f10b6b3b67d3c32f175b6/changelog_unreleased/api/12740.md)
	<https://unpkg.com/browse/prettier@3.0.0-alpha.1/>

# changes since prettier v2

## highlights

* [support plugins in esm](https://github.com/prettier/prettier/blob/008b371e3ed64d31b85f10b6b3b67d3c32f175b6/changelog_unreleased/api/13201.md)
* [support config files in esm](https://github.com/prettier/prettier/blob/008b371e3ed64d31b85f10b6b3b67d3c32f175b6/changelog_unreleased/api/13130.md)
* [support plugins with async parsers](https://github.com/prettier/prettier/blob/008b371e3ed64d31b85f10b6b3b67d3c32f175b6/changelog_unreleased/api/12748.md)

## breaking changes

*  [breaking] the minimal required node.js version is v14
*  [breaking] [all public apis are asynchronous](https://github.com/prettier/prettier/blob/008b371e3ed64d31b85f10b6b3b67d3c32f175b6/changelog_unreleased/api/12574.md)
*  [breaking] change default value of `trailingcomma` to `"all"`

### plugin system
* [breaking] [the `embed` method of a printer has now to match a completely new signature](https://deploy-preview-9583--prettier.netlify.app/docs/en/next/plugins.html#optional-embed), added [`getvisitorkeys`](https://deploy-preview-9583--prettier.netlify.app/docs/en/next/plugins.html#optional-getvisitorkeys) method
*  [breaking]  [the second argument `parsers` passed to `parsers.parse` has been removed](https://github.com/prettier/prettier/blob/008b371e3ed64d31b85f10b6b3b67d3c32f175b6/changelog_unreleased/api/13268.md)
*  [breaking]  [`prettier.doc.builders.concat` has been removed](https://github.com/prettier/prettier/blob/008b371e3ed64d31b85f10b6b3b67d3c32f175b6/changelog_unreleased/api/13203.md)
* [breaking] [`texttodoc` trims trailing hard lines now](https://github.com/prettier/prettier/blob/008b371e3ed64d31b85f10b6b3b67d3c32f175b6/changelog_unreleased/api/13220.md)

---

**full changelog**: https://github.com/prettier/prettier/compare/2.7.1...3.0.0-alpha.1