v4.0.0:
release 4.0 dropped support for version of typescript before 4.0. it added support for the new release of gulp (4.0). the important changes can be found in the release notes for 4.0.0-alpha.1:

- updated the test infrastructure (#545)
- updated dependencies (#551)
  - removed dependency on `gulp-util`
  - updated vinyl
- clarified the configuration of source maps in the readme (#538)
- fixed an issue where paths in additional options in `createproject(..)` where not resolved correctly (#525)
- correctly use the `finish` and `end` events (#540)
- don't show 'emit failed' with `noemit: true` (#490)
- write errors to stdout instead of stderr, since the errors are not failures of gulp-typescript.