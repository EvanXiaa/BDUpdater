10.0.0
<img src="https://user-images.githubusercontent.com/19343/93252989-3ec35380-f764-11ea-9891-4b386348bfdd.png" alt="Coat of arms of Oregon" width="200" height="200" align="right">

Autoprefixer 10 is based on top of [PostCSS 8](https://github.com/postcss/postcss/releases/tag/8.0.0) (check **Known Issues** section before updating).

Node.js 6.x, 8.x, 11.x support was removed.

Now you need to install Autoprefixer by `npm install --save-dev autoprefixer postcss`. We moved `postcss` from `dependencies` to `peerDependencies` according to [new PostCSS plugin guidelines](https://github.com/postcss/postcss/blob/master/docs/guidelines/plugin.md).