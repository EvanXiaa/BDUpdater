v4.0.0-rc.0
## Release Candidate

This is a release candidate. We are still working on v4.0.0, and API stability isn't guaranteed, though we'll aim to keep it fairly consistent.

You can try this build by installing or depending on [`svgo@4.0.0-rc.0`](https://www.npmjs.com/package/svgo/v/4.0.0-rc.0?activeTab=versions), or [`svgo@rc`](https://www.npmjs.com/package/svgo/v/4.0.0-rc.0?activeTab=versions).

Please report any problems you encounter in the [GitHub issue tracker](https://github.com/svg/svgo/issues). 👍🏽

## Breaking Changes

A brief summary, if you use the browser bundle of SVGO, or import/require anything except the base `svgo` path, such as `svgo/lib/builtin`, then you will very likely have to make code changes to update to version 4.

### Dropping Support for Node.js v14

Node.js v14 is no longer supported by the Node.js team, including security support from 30 April 2023. Node.js v16 is no longer supported too, but as many are still using it, we'll continue to support Node.js v16 for now.

This allows us to update our dependencies to more recent versions, and to access more modern Node.js APIs.

Node.js v14 may still work at the time of this release based, but we will no longer be testing against v14 from now on.

### Imports/Exports

We use the `exports` field in `package.json` to define the public interface of the package. This enforces boundaries between the intended public API and any internal structures/helpers that we use internally.

There are two ways to import SVGO:

* `svgo` - for normal usage, such as scripts or server-side applications.
* `svgo/browser` - for in-browser usage.

If you use the browser bundle, you must amend how you import it:

```diff
- import { optimize } from "svgo/dist/svgo.browser.js";
+ import { optimize } from "svgo/browser";
```

For all interfaces, you can import the default export which yields an object with all exported properties, or destruct while importing to get an individual property:

```js
// default.mjs
import SVGO from 'svgo';
console.log(SVGO.VERSION); // 4.0.0-rc.0

// destruct.mjs
import { VERSION } from 'svgo';
console.log(VERSION);  // 4.0.0-rc.0

// default.cjs
const SVGO = require('svgo');
console.log(SVGO.VERSION);  // 4.0.0-rc.0

// destruct.cjs
const { VERSION } = require('svgo');
console.log(VERSION); // 4.0.0-rc.0

// browser.mjs
import SVGO from 'svgo/browser';
console.log(SVGO.VERSION); // 4.0.0-rc.0
```

We support 3 environments, ESM, Common JS, and browser. The table below describes the properties that are available in each environment (excludes types):

| | ESM | Common JS | Browser |
|---|---|---|---|
| `VERSION` | ✅ | ✅ | ✅ |
| `optimize` | ✅ | ✅ | ✅ |
| `builtinPlugins` | ✅ | ✅ | ✅ |
| `loadConfig` | ✅ | ✅ | |

#### Importing Plugins

If you import/require the array of built-in plugins, or a single plugin during runtime, this is now a top-level export instead:

```diff
// builtin.mjs - get an array of all built-in plugins
- import { builtin } from 'svgo/lib/builtin';
+ import { builtinPlugins } from 'svgo'

// plugin.mjs - get a single plugin
- import presetDefault from 'svgo/plugins/preset-default';
+ import { builtinPlugins } from 'svgo';
+ const prefixDefault = builtinPlugins.find(plugin => plugin.name === 'preset-default');

// plugin-map.mjs - get all plugins as a map using the plugin name as a key
import { builtinPlugins } from 'svgo';
const pluginMap = builtinPlugins.reduce((acc, val) => acc.set(val.name, val), new Map());
```

### Default Plugins

Both removeViewBox and removeTitle have been disabled by default. Both have been major pain points for users, and don't make sense to enable in most cases. Other libraries wrapping SVGO have also been disabling these plugins by default, such as [Docusaurus](https://docusaurus.io/) and [SVGR](https://react-svgr.com/).

* removeViewBox removes the scalability of SVGs, which is unexpected given the S stands for scalable.
* removeTitle reduces accessibility, which preserving accessibility is more important than optimization.

If you would like either of these plugins enabled, you can do so by configuring it in the SVGO config, see the [README](https://github.com/svg/svgo?tab=readme-ov-file#configuration) for more context:

```diff
  export default {
    plugins: [
      'preset-default', // built-in plugins enabled by default
+     'removeViewBox',
+     'removeTitle',
    ],
  };
```

### removeScriptElement → removeScripts

The removeScriptElement plugin has been renamed to removeScripts, to more accurately reflect what the plugin does. It does not only remove the `<script>` tag, but also event handlers and script URIs from links.

To migrate, amend your SVGO config to refer to `removeScripts` instead if you use that plugin.

```diff
  export default {
    plugins: [
      'preset-default', // built-in plugins enabled by default
-     'removeScriptElement',
+     'removeScripts',
    ],
  };
```

---

## What Else

### ESM

SVGO is now a dual package, serving for both Common JS and ESM usage. To be more explicit, SVGO will continue to work in Common JS projects!

Thanks to @jdufresne for doing the bulk of the work.

### Default Behavior

* convertColors, now converts all references to colors excluding references to IDs to lowercase. This can be disabled by setting `convertCase` to `false`.

### Bug Fixes

* cleanupIds, treat both URI encoded and non-URI encoded IDs as the same. By @liuweifeng in #1982 
* collapseGroups, check styles as well as attributes. By @johnkenny54 in #1952
* collapseGroups, move attributes atomically. By @johnkenny54 in https://github.com/svg/svgo/pull/1930
* convertPathData, fix q control point when item is removed. By @KTibow in https://github.com/svg/svgo/pull/1927
* convertPathData, preserve vertex for markers only paths. By @SethFalco in #1967 
* mergePaths, don't merge paths if attributes/styles depend on the node's bounding box. By @johnkenny54 in #1964 
* moveElemsAttrsToGroups, no longer moves the transforms if group has the `filter` attribute. By @johnkenny54 in #1933
* prefixIds, fixed issue where some IDs were not prefixed when style tag contained XML comments. By @john-neptune in #1942
* removeHiddenElems, don't remove node if child element has a referenced ID. By @johnkenny54 in https://github.com/svg/svgo/pull/1925
* removeHiddenElems, treat `path[opacity=0]` as a non-rendering node. By @johnkenny54 in #1948
* removeUselessDefs, don't remove node if child element has an ID. By @johnkenny54 in https://github.com/svg/svgo/pull/1923
* When stringifying path data, include a space before numbers represented in scientific notation. By @johnkenny54 in #1961 
* No longer crashes when the output (`-o` argument) ends with a trailing slash to a location that didn't exist. By @SethFalco in #1954 

### Features

* Add `VERSION` export so get the version of SVGO during runtime. By @SethFalco in #2016
* Introduce an `isPreset` and `plugins` property to plugins, which are only defined for presets. This will indicate if the plugin is a preset, and return the plugins that in the preset in the order they are invoked.

### SVG Optimization

* convertColors, introduce parameter to convert colors to common casing (lowercase/uppercase). By @JayLeininger in https://github.com/svg/svgo/pull/1692
* removeDeprecatedAttrs, new plugin that is disabled by default to remove SVG attributes that are deprecated. By @jdufresne in #1869

## Metrics

Before and after using vectors from various sources, with the default preset of each respective version:

| SVG | Original | v3.3.2 | v4.0.0-rc.0 | Delta |
|---|---|---|---|---|
| [Arch Linux Logo](https://archlinux.org/art/) | 9.529 KiB | 4.115 KiB | 4.097 KiB | ⬇️ 0.018 KiB |
| [Blobs](https://gitlab.gnome.org/GNOME/gnome-backgrounds/-/blob/main/backgrounds/blobs-d.svg) | 50.45 KiB | 42.623 KiB | 42.633 KiB | ⬆️ 0.01 KiB |
| [Isometric Madness](https://inkscape.org/~Denis_Kuznetsky/%E2%98%85isometric-madness) | 869.034 KiB | 540.582 KiB | 540.141 KiB | ⬇️ 0.441 KiB |
| [tldr-pages Banner](https://github.com/tldr-pages/tldr/blob/main/images/banner.svg) | 2.071 KiB | 1.07 KiB | 1.07 KiB | |
| [Wikipedia Logo](https://en.wikipedia.org/wiki/File:Wikipedia-logo-v2.svg) | 161.551 KiB | 111.668 KiB | 111.727 KiB | ⬆️ 0.059 KiB |

Note: The increase in size from previous versions is from disabling `removeViewBox` and `removeTitle`, with the benefit of preserving scalability and accessibility.

Before and after of the browser bundle of each respective version:

| | v3.3.2 | v4.0.0-rc.0 | Delta |
|---|---|---|---|
| svgo.browser.js | 753.0 kB | 754.9 kB | ⬆️ 1.9 kB |
