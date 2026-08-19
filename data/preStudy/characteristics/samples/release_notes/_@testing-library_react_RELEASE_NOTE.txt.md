v16.0.0
# [16.0.0](https://github.com/testing-library/react-testing-library/compare/v15.0.7...v16.0.0) (2024-06-03)


### Features

* Move `@testing-library/dom` and `@types/react-dom`  to peer dependencies ([#1305](https://github.com/testing-library/react-testing-library/issues/1305)) ([a4744fa](https://github.com/testing-library/react-testing-library/commit/a4744fa904bf11812c92093226c3805450472636))


### BREAKING CHANGES

* `@testing-library/dom` was moved to a peer dependency and needs to be explicitly installed. This reduces the chance of having conflicting versions of `@testing-library/dom` installed that frequently caused bugs when used with `@testing-library/user-event`. We will also be able to allow new versions of `@testing-library/dom` being used without a SemVer major release of `@testing-library/react` by just widening the peer dependency.
`@types/react-dom` needs to be installed if you're typechecking files using `@testing-library/react`.



