v13.0.0-beta.1
# [13.0.0-beta.1](https://github.com/semantic-release/commit-analyzer/compare/v12.0.0...v13.0.0-beta.1) (2024-05-25)


### Features

* support latest conventional-changelog packages ([0254d7a](https://github.com/semantic-release/commit-analyzer/commit/0254d7a5c59ccc4692b86218554f8850ebf46682))


### BREAKING CHANGES

* by supporting the latest major versions of conventional-changelog packages, we are
dropping support for previous major versions of those packages due to the breaking changes between
majors. this only impacts your project if you are installing alongside semantic-release, so updating
those packages to latest version should be the only change you need for this update. no action
should be necessary if you are using default semantic-release config



