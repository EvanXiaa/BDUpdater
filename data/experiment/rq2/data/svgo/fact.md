## v4.0.0

![Banner celebrating the release of SVGO v4.0.0. Includes the SVGO mascot drawing on a chalkboard with the changes in default plugins. For example, removeViewBox was moved from default plugins to available plugins.](https://github.com/user-attachments/assets/cba49a60-dbcd-477a-8f37-bd08cfd574c3)

<div align="center">

_Illustration by [Vukory](https://vukory.art)_

</div>

It's been just over a year since our first release candidate, but I believe we can now release SVGO v4.0.0 with confidence! Thank you to all contributors who tested our RC builds and reported issues back up, this really smoothed out the process.

We actually wanted to do the release sooner, but it was a challenge to find the right time to publish a major release, since that means setting time aside to support users through migrations, helping downstream projects migrate, being available to fix or document things that users found to have an unexpected impact by this release, etc. I appreciate everyone's patience, and now that this is done, we can hopefully increase the pace of development again and tackle that backlog of old bugs. ^-^'

## Breaking Changes

Please refer to the [Migration Guide from v3 to v4](https://svgo.dev/docs/migrations/migration-from-v3-to-v4/) for a more concise version! This section is more verbose as it delves into the motivation of changes too.

### Dropped Support for Node.js v14

Node.js v14 is no longer supported by the Node.js team, including security support, since 30 April 2023. Node.js v16 is no longer supported either, but as some are still using it, we'll save dropping support for Node.js v16 for the next major release. 

This allows us to update our dependencies to more recent versions and to access more modern Node.js APIs.

Node.js v14 _may_ still work at the time of this release, but we'll no longer be testing against v14 from now on.

### Default Plugins

Both removeViewBox and removeTitle have been disabled by default. Both have been major pain points for users and don't make sense to enable in most cases. Other libraries wrapping SVGO have also been disabling these plugins by default, such as [Docusaurus](https://docusaurus.io/) and [SVGR](https://react-svgr.com/).

* removeViewBox removes the scalability of SVGs.
* removeTitle reduces accessibility, which preserving accessibility is more important than optimization.

If you would like either of these plugins enabled, you can do so by configuring it in the SVGO config, see the [README](https://github.com/svg/svgo?tab=readme-ov-file#configuration) for more context, however please read the warnings described in the documentation of the plugins first:

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

### Imports/Exports

We now enforce boundaries between the intended public API and any internal structures/helpers. This is the biggest change in SVGO's JavaScript API and will enable maintainers and users to have a mutual understanding of what is public API and what isn't.

There are two ways to import SVGO:

* `svgo` — for normal usage, such as scripts or server-side applications.
* `svgo/browser` — for browser usage.

If you use the browser bundle, you must amend how you import SVGO:

```diff
- import { optimize } from 'svgo/dist/svgo.browser.js';
+ import { optimize } from 'svgo/browser';
```

For ESM/browser, you must use named imports:

```js
// ESM and Browser, named exports
import { VERSION } from 'svgo';
console.log(VERSION);  // 4.0.0-rc.0

// ESM and Browser, import all
import * as svgo from 'svgo/browser';
console.log(svgo.VERSION); // 4.0.0-rc.0

// Common JS, default export
const svgo = require('svgo');
console.log(svgo.VERSION);  // 4.0.0-rc.0

// CommonJS, named exports
const { VERSION } = require('svgo');
console.log(VERSION); // 4.0.0-rc.0
```

We support 3 environments, ESM, Common JS, and browser. The only functional difference is that the `loadConfig` function is not exported in the browser bundle.

If you depended on a helper that we haven't declared as public, then you are encouraged to implement it yourself, or dig into our source and copy it over to your project.

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

### Selector Helpers

The `XastNode#parentNode` property was declared legacy and pending removal for v4, but was still used internally. The remaining instances have now been removed, which required a refactor of the selector helpers.

This effects custom plugins that use any of the following functions, where the `selector` (2nd) argument could reference parent or sibling nodes (i.e. `div > span`):

* `querySelectorAll`
* `querySelector`
* `matches`

Previously, these functions had the context of the whole node tree, even if a child node was passed to it. It no longer has that context by default. The new API for these functions is as follows:

```js
// applies `selector` with the context of the `childNode` and its descendants
const nodes = querySelectorAll(childNode, selector);

// applies `selector` with the context of the entire node tree relative from `childNode`
// the `rootNode` is required if the result of `selector` may depend on the parent or sibling of `childNode`
const nodes = querySelectorAll(childNode, selector, rootNode);

// this usage has the same behavior as v3, as `rootNode` is already the entire node tree 
const nodes = querySelectorAll(rootNode, selector);
```

A helper has been provided named `#mapNodesToParents`, which does this for you. This can be used to easily migrate to the new API. If you're not sure if you need it, then it's safer to take this approach. The third argument won't be necessary if `selector` does not traverse nodes, for example, querying using one or more attributes of a single node.

```diff
- import { querySelectorAll } from 'svgo';
+ import { querySelectorAll, mapNodesToParents } from 'svgo';

- const nodes = querySelectorAll(childNode, selector);
+ const nodes = querySelectorAll(childNode, selector, mapNodesToParents(rootNode));
```

---

## What Else

### ESM

SVGO is now a dual package, serving for both Common JS and ESM usage. To be more explicit, SVGO will continue to work on Common JS projects!

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
* removeEmptyContainers, fixed an issue where we removed empty containers with filters applied via CSS, when it should be skipped. By @SethFalco in #2089
* removeHiddenElems, don't remove node if child element has a referenced ID. By @johnkenny54 in https://github.com/svg/svgo/pull/1925
* removeHiddenElems, treat `path[opacity=0]` as a non-rendering node. By @johnkenny54 in #1948
* removeUselessDefs, don't remove node if child element has an ID. By @johnkenny54 in https://github.com/svg/svgo/pull/1923
* When stringifying path data, include a space before numbers represented in scientific notation. By @johnkenny54 in #1961 
* No longer crashes when the output (`-o` argument) ends with a trailing slash to a location that didn't exist. By @SethFalco in #1954 

### Features

* Add `VERSION` export so get the version of SVGO during runtime. By @SethFalco in #2016
* Introduce an `isPreset` and `plugins` property to plugins, which are only defined for presets. This will indicate if the plugin is a preset, and return the plugins that are in the preset in the order they are invoked.

### SVG Optimization

* convertColors, introduce parameter to convert colors to common casing (lowercase/uppercase). By @JayLeininger in https://github.com/svg/svgo/pull/1692
* removeDeprecatedAttrs, new plugin that is disabled by default to remove SVG attributes that are deprecated. By @jdufresne in #1869
* removeEditorsNSData, include Boxy SVG namespace in the list of editor namespaces to remove. By @sisp in #2008
* removeEditorsNSData, include Krita namespace in the list of editor namespaces to remove. By @SethFalco in #2131

### Performance

* Use string methods instead of a regular expression when parsing SVGs. By @SethFalco in #2133

### Developer Experience

* We now generate our type declarations from JSDoc comments instead of maintaining them manually. Types will be much more accurate, include more documentation, and are guaranteed to be in sync with the implementation.

## Metrics

Before and after using vectors from various sources, with the default preset of each respective version:

| SVG | Original | v3.3.2 | v4.0.0 | Delta |
|---|---|---|---|---|
| [Arch Linux Logo](https://archlinux.org/art/) | 9.529 KiB | 4.115 KiB | 4.097 KiB | ⬇️ 0.018 KiB |
| [Blobs](https://gitlab.gnome.org/GNOME/gnome-backgrounds/-/blob/main/backgrounds/blobs-d.svg) | 50.45 KiB | 42.623 KiB | 42.633 KiB | ⬆️ 0.01 KiB |
| [Isometric Madness](https://inkscape.org/~Denis_Kuznetsky/%E2%98%85isometric-madness) | 869.034 KiB | 540.582 KiB | 540.141 KiB | ⬇️ 0.441 KiB |
| [tldr-pages Banner](https://github.com/tldr-pages/tldr/blob/main/images/banner.svg) | 2.071 KiB | 1.07 KiB | 1.07 KiB | |
| [Wikipedia Logo](https://en.wikipedia.org/wiki/File:Wikipedia-logo-v2.svg) | 161.551 KiB | 111.668 KiB | 111.727 KiB | ⬆️ 0.059 KiB |

Note: The increase in size from previous versions is from disabling `removeViewBox` and `removeTitle`, with the benefit of preserving scalability and accessibility.

Before and after of the browser bundle of each respective version:

| | v3.3.2 | v4.0.0 | Delta |
|---|---|---|---|
| svgo.browser.js | 753.0 kB | 780.2kB | ⬆️ 27.2 kB |
