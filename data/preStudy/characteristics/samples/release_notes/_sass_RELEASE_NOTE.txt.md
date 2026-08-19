1.0.0:
**initial stable release.** 

### changes since 1.0.0-rc.1 

* allow `!` in custom property values ([#260][]). 

[#260]: https://github.com/sass/dart-sass/issues/260 

#### dart api 

* remove the deprecated `render()` function. 

#### node api 

* errors are now subtypes of the `error` type. 

* allow both the `data` and `file` options to be passed to `render()` and   `rendersync()` at once. the `data` option will be used as the contents of the   stylesheet, and the `file` option will be used as the path for error reporting   and relative imports. this matches node sass's behavior.