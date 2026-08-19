<a name="2.6.0"></a>
# [2.6.0](https://github.com/jshint/jshint/compare/2.5.11...2.6.0) (2015-01-21)


### Bug Fixes

* Add missing globals to browser environment ([32f02e0](https://github.com/jshint/jshint/commit/32f02e0))
* Allow array, grouping and string form to follow spread operator in function call args. ([437655a](https://github.com/jshint/jshint/commit/437655a)), closes [#2060](https://github.com/jshint/jshint/issues/2060) [#2060](https://github.com/jshint/jshint/issues/2060)
* Correct bug in enforcement of `singleGroups` ([5fedda6](https://github.com/jshint/jshint/commit/5fedda6)), closes [#2064](https://github.com/jshint/jshint/issues/2064)
* Remove dead code ([3b5d94a](https://github.com/jshint/jshint/commit/3b5d94a)), closes [#883](https://github.com/jshint/jshint/issues/883)
* Remove dead code for parameter parsing ([a1d5817](https://github.com/jshint/jshint/commit/a1d5817))
* Revert unnecessary commit ([a70bbda](https://github.com/jshint/jshint/commit/a70bbda))

### Features

* `elision` option to relax "Extra comma" warnings ([cbfc827](https://github.com/jshint/jshint/commit/cbfc827)), closes [#2062](https://github.com/jshint/jshint/issues/2062)
* Add new Jasmine 2.1 globals to "jasmine" option ([343c45e](https://github.com/jshint/jshint/commit/343c45e)), closes [#2023](https://github.com/jshint/jshint/issues/2023)
* Support generators in class body ([ee348c3](https://github.com/jshint/jshint/commit/ee348c3))


### BREAKING CHANGES

* In projects which do not enable ES3 mode, it is now an error by default to use elision array elements,
also known as empty array elements (such as `[1, , 3, , 5]`)
