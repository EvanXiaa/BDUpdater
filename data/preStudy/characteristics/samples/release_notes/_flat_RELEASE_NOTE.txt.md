v6.0.0
## New Features ✨
- Package is now distributed in the ECMAScript module syntax (see #149).
- Definitions for TypeScript are now included out of the box (see #151).

## Breaking Changes 💥
- Support for all module formats besides ECMAScript modules has been dropped.
- Default export has been dropped in favor of a named one.
- Officially supported Node.js version is now 18 and up (all others are [end-of-life](https://github.com/nodejs/Release/#end-of-life-releases)).

## Migration :truck:
We are now shipping `flat` as a pure ECMAScript module, if you are still using CommonJS in your application follow this [migration guide](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

The default export has been dropped in favor of a named one, if you are using the default export make sure to update your imports:

```diff
-import flatten from 'flat'
+import { flatten } from 'flat'
```

If you are a user of TypeScript you can remove `@types/flat` from your project. The type definitions are now included in the package itself, so it is no longer required to keep a separate dependency around.

```sh
npm uninstall @types/flat
```