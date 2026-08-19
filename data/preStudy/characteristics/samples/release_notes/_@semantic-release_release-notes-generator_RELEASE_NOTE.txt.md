v14.0.0-beta.1
# [14.0.0-beta.1](https://github.com/semantic-release/release-notes-generator/compare/v13.0.0...v14.0.0-beta.1) (2024-05-17)


### Features

* support latest conventional-changelog packages ([#643](https://github.com/semantic-release/release-notes-generator/issues/643)) ([2bce0d3](https://github.com/semantic-release/release-notes-generator/commit/2bce0d3504b9ed343dc7cb9c1ebde21f168b6f07))


### BREAKING CHANGES

* by supporting the latest major versions of conventional-changelog packages, we are dropping support for previous major versions of those packages due to the breaking changes between majors. this only impacts your project if you are installing alongside semantic-release, so updating those packages to latest version should be the only change you need for this update. no action should be necessary if you are using default semantic-release config



