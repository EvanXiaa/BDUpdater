v2.0.0
<a name="2.0.0"></a>
# [2.0.0](https://github.com/webpack-contrib/uglifyjs-webpack-plugin/compare/v1.3.0...v2.0.0) (2018-09-14)


### Bug Fixes

* default extract comment condition is case insensitivity

### Features

* full coverage schema options validation
* enable inline optimization by default

### BREAKING CHANGES

* Switch back to [uglify-js](https://github.com/mishoo/UglifyJS2) (`uglify-es` is abandoned, if you need uglify ES6 code please use [terser-webpack-plugin](https://github.com/webpack-contrib/terser-webpack-plugin)).
* Changed function signature for `warningsFilter` option (now first argument is `warning`, second is `source`).
* Enforces `peerDependencies` of `"webpack": "^4.3.0`.
* Enforces `engines` of `"node": ">= 6.9.0 <7.0.0 || >= 8.9.0`