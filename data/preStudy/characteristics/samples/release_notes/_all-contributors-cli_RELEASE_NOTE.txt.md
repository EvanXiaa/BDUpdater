v6.0.0
# [6.0.0](https://github.com/all-contributors/all-contributors-cli/compare/v5.11.0...v6.0.0) (2019-02-06)


* BREAKING CHANGE: changed generator to an HTML based one (#157) ([b0c3376](https://github.com/all-contributors/all-contributors-cli/commit/b0c3376)), closes [#157](https://github.com/all-contributors/all-contributors-cli/issues/157) [#154](https://github.com/all-contributors/all-contributors-cli/issues/154) [#154](https://github.com/all-contributors/all-contributors-cli/issues/154)


### BREAKING CHANGES

* (in 2babe26b08d2791fdf6ac3e95c6027c26b5fc5c5) The resulting contributors table is in HTML/CSS instead of being in Markdown.

* refactor(generate): removed the style from the generation

Removed the `<style>` block from the generated HTML code as it's redundant on Github (since it's one
of the non-whitelisted tags). The `README.md` was also updated reflecting the breaking changes.

* refactor(generate): image height and tweaks

Added `height` to images for avatars, quoted some `<table>` attributes and updated `README.md`

* docs: drop TOC



