v2.0.0:
<a name"2.0.0"></a>

## 2.0.0 (2017-02-20)

#### bug fixes
- **logs:** upgrade prettier-eslint (#20) ([24818a69](https://github.com/kentcdodds/prettier-eslint-cli/commit/24818a69))

#### breaking changes
- `--log` and `--silly-logs` removed in favor of `--log-level`
  ([24818a69](https://github.com/kentcdodds/prettier-eslint-cli/commit/24818a69))

v3.0.0:
<a name"3.0.0"></a>

## 3.0.0 (2017-02-21)

#### features
- **ignore:** add support for eslint-ignore (#24) ([7caaf179](https://github.com/kentcdodds/prettier-eslint-cli/commit/7caaf179), closes [#16](https://github.com/kentcdodds/prettier-eslint-cli/issues/16))

#### breaking changes
- files matched by an `.eslintignore` will no longer be formatted by default. use `--no-eslint-ignore` to disable this
  ([7caaf179](https://github.com/kentcdodds/prettier-eslint-cli/commit/7caaf179))

v4.0.0:
<a name"4.0.0"></a>
## 4.0.0 (2017-05-21)


#### bug fixes

* **release:** manually release a major version ([d68ae4ff](https://github.com/prettier/prettier-eslint-cli/commit/d68ae4ff))


#### breaking changes

* no more need for --prettier prefixing for prettier's options
 ([d68ae4ff](https://github.com/prettier/prettier-eslint-cli/commit/d68ae4ff))


v5.0.0:
# [5.0.0](https://github.com/prettier/prettier-eslint-cli/compare/v4.7.1...v5.0.0) (2019-06-17)


### chore

* update eslint and require node 8+ ([489a0b3](https://github.com/prettier/prettier-eslint-cli/commit/489a0b3))


### breaking changes

* update eslint to version 5 and require node 8+




v6.0.0:
## [6.0.0](https://github.com/prettier/prettier-eslint-cli/compare/v5.0.1...v6.0.0) (2022-05-11)
## feature
* :package: support eslint 8 (https://github.com/prettier/prettier-eslint-cli/pull/431) ([4e4077d](https://github.com/prettier/prettier-eslint-cli/commit/4e4077d9ede7c28be92fe71888883c777d2c6604))
## chore
* move ident-string to prod deps (https://github.com/prettier/prettier-eslint-cli/pull/425) ([afc22f5](https://github.com/prettier/prettier-eslint-cli/commit/afc22f50cfddc3d5be7d22b97f421f3404540388))
### breaking changes
requires eslint 8. eslint 8 api changes caused the format function to now be asynchronous.
requires minimum node 12 as required by eslint 8

v7.0.0:
# [7.0.0](https://github.com/prettier/prettier-eslint-cli/compare/v6.0.1...v7.0.0) (2022-08-14)


### features

* make the cli work with/without `prettier-eslint` peer ([#438](https://github.com/prettier/prettier-eslint-cli/issues/438)) ([39c38b5](https://github.com/prettier/prettier-eslint-cli/commit/39c38b50ee710fd56ad07dfb4c4463b57427eb79))


### breaking changes

* bump all upgradable (dev)dependencies except pure esm

## what's changed
* feat!: bump all upgradable (dev)dependencies except pure esm by @jounqin in https://github.com/prettier/prettier-eslint-cli/pull/437
* breaking change: bump all upgradable (dev)dependencies except pure esm by @jounqin in https://github.com/prettier/prettier-eslint-cli/pull/439
* docs: cleanup build and sponsors badges by @jounqin in https://github.com/prettier/prettier-eslint-cli/pull/440
* feat: make the cli work with/without `prettier-eslint` peer by @jounqin in https://github.com/prettier/prettier-eslint-cli/pull/438


**full changelog**: https://github.com/prettier/prettier-eslint-cli/compare/v6.0.1...v7.0.0