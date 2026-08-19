v6.0.0
First and foremost a huge shout out to @wkillerud for making this long awaited release possible <3

# Breaking changes

- Migrate to use the new Sass JS API by default (@wkillerud, #846)

# Documentation

- Update the watch `task` documentation (@g1eny0ung, #847) & (@xzyfer)

# Upgrading to v6

`gulp-sass` version 6 uses the new [compile](https://sass-lang.com/documentation/js-api/modules#compileString) function internally by default. If you use any options, for instance custom importers, please compare the [new options](https://sass-lang.com/documentation/js-api/modules#compileString) with the [legacy options](https://sass-lang.com/documentation/js-api/modules#render) in order to migrate. For instance, the `outputStyle` option is now called `style`.

```diff
  function buildStyles() {
    return gulp.src('./sass/**/*.scss')
-     .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
+     .pipe(sass({style: 'compressed'}).on('error', sass.logError))
      .pipe(gulp.dest('./css'));
  };
```

If you want to keep using the legacy API while it's available, you can.

```js
const sass = require('gulp-sass/legacy')(require('sass'));
```
or to continue using node-sass

```sh
npm install gulp-sass node-sass
```
```js
const sass = require('gulp-sass/legacy')(require('node-sass'));
```

If you use source maps, you may see the result change somewhat. The result will typically be absolute `file:` URLs, rather than relative ones. The result may also be the source itself, URL encoded. You can [optionally add custom importers](https://sass-lang.com/documentation/js-api/interfaces/CompileResult#sourceMap) to adjust the source maps according to your own needs.

## New Contributors
* @wkillerud made their first contribution in https://github.com/dlmanning/gulp-sass/pull/846
* @g1eny0ung made their first contribution in https://github.com/dlmanning/gulp-sass/pull/847

**Full Changelog**: https://github.com/dlmanning/gulp-sass/compare/v5.1.0...v6.0.0