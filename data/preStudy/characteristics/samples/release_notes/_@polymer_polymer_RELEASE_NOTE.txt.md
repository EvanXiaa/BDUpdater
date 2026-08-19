v3.0.0
# Breaking Changes
- As [announced previously](https://www.polymer-project.org/blog/2018-02-26-3.0-preview-paths-and-names), we're using ES Modules now! You'll need to convert your HTML Imports files to modules either manually, or using our [modulizer](https://github.com/Polymer/polymer-modulizer) tool.
- With the ES Module change, a lot of API names have shortened now that they don't use the `Polymer` global. Here's an example:
  - Before: 
    ```html
    <link rel="import" href="polymer/lib/utils/case-map.html">
    <script>Polymer.CaseMap</script>
    ```
    After:
    ```js
    import {CaseMap} from "@polymer/polymer/lib/utils/case-map.js";
    ```
- However, `Polymer.Element` became `PolymerElement`, as `Element` would shadow over the native `Element` class.
- `importHref()` functionality is removed, please use the ES Module equivalent: `import('path/to/module.js'
)`
  - Polymer CLI tooling and Webpack will automatically fix this up for browsers that don't support ES Modules. 

# Raw Notes
- use released versions of shadycss and webcomponentsjs ([commit](https://github.com/Polymer/polymer/commit/8f79ec40))

- Bump dependencies ([commit](https://github.com/Polymer/polymer/commit/8894e22b))

- Run Chrome & FF serially to try and help flakiness ([commit](https://github.com/Polymer/polymer/commit/95740463))

- Fix lint warning ([commit](https://github.com/Polymer/polymer/commit/ecf36f8a))

- Bump to cli 1.7.0 ([commit](https://github.com/Polymer/polymer/commit/ccb29d27))

- Removing support for returning strings from template getter. (Per previous documented deprecation: https://www.polymer-project.org/2.0/docs/devguide/dom-template#templateobject) ([commit](https://github.com/Polymer/polymer/commit/ba4491d5))

- Fix typos and nits ([commit](https://github.com/Polymer/polymer/commit/c54ff70a))

- Update to Gulp 4 ([commit](https://github.com/Polymer/polymer/commit/4e31768c))

- Add serve command to package.json and update package-lock.json ([commit](https://github.com/Polymer/polymer/commit/eb72d5aa))

- Fix for browsers that don't have input.labels. ([commit](https://github.com/Polymer/polymer/commit/036e4f66))

- Tweak introductory note, fix webpack capitalization ([commit](https://github.com/Polymer/polymer/commit/b823620e))

- gestures: Avoid spreading non-iterable in older browsers ([commit](https://github.com/Polymer/polymer/commit/2ce4f700))

- wip ([commit](https://github.com/Polymer/polymer/commit/f4534c6a))

- Readme: very small tweaks ([commit](https://github.com/Polymer/polymer/commit/d896cdd0))

- Tweak wording. ([commit](https://github.com/Polymer/polymer/commit/fb7630c3))

- Fix link ([commit](https://github.com/Polymer/polymer/commit/fc0ce189))

- Re-order sections ([commit](https://github.com/Polymer/polymer/commit/ee6a67ee))

- Fix LitElement typo ([commit](https://github.com/Polymer/polymer/commit/928c47fc))

- Depend on polymer-cli rather than wct ([commit](https://github.com/Polymer/polymer/commit/503f5631))

- Minor tweaks ([commit](https://github.com/Polymer/polymer/commit/e924ba86))

- Update README for 3.x ([commit](https://github.com/Polymer/polymer/commit/956bba73))

- Update Edge testing versions. ([commit](https://github.com/Polymer/polymer/commit/445c979b))

- Exclude all Edge versions from keyframe/font tests. ([commit](https://github.com/Polymer/polymer/commit/85278860))

- Update wcjs version. ([commit](https://github.com/Polymer/polymer/commit/4805e31f))

- Add .npmignore file (#5215) ([commit](https://github.com/Polymer/polymer/commit/b3c36df7))

- Use node 9 ([commit](https://github.com/Polymer/polymer/commit/0bb5d7c5))

- Use module flags for wct ([commit](https://github.com/Polymer/polymer/commit/8abf2ec9))

- Use babel parser for aslant for dynamic import. ([commit](https://github.com/Polymer/polymer/commit/bddeff4a))

- Fix lint errors. ([commit](https://github.com/Polymer/polymer/commit/dea23515))

- 3.0.0-pre.13 ([commit](https://github.com/Polymer/polymer/commit/da2d66dc))

- [package.json] Remove version script ([commit](https://github.com/Polymer/polymer/commit/e88c1eef))

- Update dependencies ([commit](https://github.com/Polymer/polymer/commit/1ed2b310))

- Fix test typo on Chrome ([commit](https://github.com/Polymer/polymer/commit/a11febe7))

- Fixes IE11 test issues ([commit](https://github.com/Polymer/polymer/commit/8b5803c2))

- Fixes styling tests related to using HTML Imports ([commit](https://github.com/Polymer/polymer/commit/26747422))

- Remove crufty global (fixes globals.html test) ([commit](https://github.com/Polymer/polymer/commit/676f5f3d))

- Update to webcomponents 2.0.0 and webcomponents-bundle.js ([commit](https://github.com/Polymer/polymer/commit/a4d80d09))

- Fix meaningful whitespace in test assertion ([commit](https://github.com/Polymer/polymer/commit/bff03b2d))

- Fix latent mistake using old SD API ([commit](https://github.com/Polymer/polymer/commit/3f24f71d))

- Add global for wct callback when amd compiling ([commit](https://github.com/Polymer/polymer/commit/7f9de46c))

- Eliminate pre-module code from resolveUrl tests ([commit](https://github.com/Polymer/polymer/commit/a93f81f1))

- Improve documentation and legibility. ([commit](https://github.com/Polymer/polymer/commit/ab103dc1))

- Add some global whitelists ([commit](https://github.com/Polymer/polymer/commit/d6821e45))

- Fix references to js files instead of html files ([commit](https://github.com/Polymer/polymer/commit/dfcaadb2))

- Fix glob patterns for eslint ([commit](https://github.com/Polymer/polymer/commit/206cf724))

- Fix ESLint warnings ([commit](https://github.com/Polymer/polymer/commit/6d240138))

- Eliminate more canonical path usage ([commit](https://github.com/Polymer/polymer/commit/1761c79b))

- Eliminate canonical path to wcjs ([commit](https://github.com/Polymer/polymer/commit/4b7cd869))

- Remove extra polymer-legacy.js imports ([commit](https://github.com/Polymer/polymer/commit/f39aaa8c))

- Clean up Polymer fn import ([commit](https://github.com/Polymer/polymer/commit/8069dff4))

- Add WCT config used by all tests ([commit](https://github.com/Polymer/polymer/commit/f1266845))

- Clean up exports ([commit](https://github.com/Polymer/polymer/commit/0b75920f))

- Allow Polymer fn's call to Class to be overridden. ([commit](https://github.com/Polymer/polymer/commit/65d73f17))

- add sill-relevant, deleted tests back in ([commit](https://github.com/Polymer/polymer/commit/180a92ff))

- manually change inter-package dep imports from paths to names ([commit](https://github.com/Polymer/polymer/commit/d913614d))

- manually add assetpath (import.meta.url) for tests that require it ([commit](https://github.com/Polymer/polymer/commit/0c850659))

- move behavior definition to before usage ([commit](https://github.com/Polymer/polymer/commit/09b11fa4))

- define omitted class declaration ([commit](https://github.com/Polymer/polymer/commit/ec36165e))

- remove &lt; and replace with < for innerHTML ([commit](https://github.com/Polymer/polymer/commit/5ce0d24d))

- fixed typo causing test to fail ([commit](https://github.com/Polymer/polymer/commit/0caa7dab))

- fix missing dom-module in modulization ([commit](https://github.com/Polymer/polymer/commit/6c7c770c))

- revert module wait ([commit](https://github.com/Polymer/polymer/commit/12a650b1))

- wait for elements in other modules to be defined ([commit](https://github.com/Polymer/polymer/commit/f0376406))

- no more undefined.hasShadow ([commit](https://github.com/Polymer/polymer/commit/0985652e))

- removed link rel import type css tests ([commit](https://github.com/Polymer/polymer/commit/57d4190c))

- delete debugger ([commit](https://github.com/Polymer/polymer/commit/6905dd10))

- skip link rel import type css tests on native imports ([commit](https://github.com/Polymer/polymer/commit/811ee301))

- add missing css html import ([commit](https://github.com/Polymer/polymer/commit/a52148a3))

- remove importHref tests ([commit](https://github.com/Polymer/polymer/commit/a84ad782))

- Import Polymer function in tests from legacy/polymer-fn.js ([commit](https://github.com/Polymer/polymer/commit/232b0042))

- Export Polymer function from polymer-legacy.js ([commit](https://github.com/Polymer/polymer/commit/69f488b2))

- Add new wct deps. ([commit](https://github.com/Polymer/polymer/commit/a4bedbfd))

- Fixup a few places where comments were misplaced. ([commit](https://github.com/Polymer/polymer/commit/ac2fa81f))

- Fixup license comments. ([commit](https://github.com/Polymer/polymer/commit/f664f251))

- Update package.json from modulizer's output, set polymer-element.js as main. ([commit](https://github.com/Polymer/polymer/commit/5abf4728))

- Replace sources with modulizer output. ([commit](https://github.com/Polymer/polymer/commit/cf3b7215))

- Rename HTML files to .js files to trick git's rename detection. ([commit](https://github.com/Polymer/polymer/commit/527d2cdd))

- Delete typings for now. ([commit](https://github.com/Polymer/polymer/commit/03d85982))

- Add reasoning for suppress missingProperties ([commit](https://github.com/Polymer/polymer/commit/61ca60e4))

- Don't rely on dom-module synchronously until WCR. ([commit](https://github.com/Polymer/polymer/commit/e64bd0ba))

- Avoid closure warnings. ([commit](https://github.com/Polymer/polymer/commit/412bb1e0))

- Add ability to define importMeta on legacy elements. Fixes #5163 ([commit](https://github.com/Polymer/polymer/commit/616f6662))

- Allow legacy element property definitions with only a type. Fixes #5173 ([commit](https://github.com/Polymer/polymer/commit/d321c6c9))

- Update docs. ([commit](https://github.com/Polymer/polymer/commit/c8c9e24d))

- Use Polymer.ResolveUrl.pathFromUrl ([commit](https://github.com/Polymer/polymer/commit/d9d3e439))

- Fix test under shadydom. Slight logic refactor. ([commit](https://github.com/Polymer/polymer/commit/2128ebe2))

- Fix lint warning ([commit](https://github.com/Polymer/polymer/commit/fb741ee3))

- Add importMeta getter to derive importPath from modules. Fixes #5163 ([commit](https://github.com/Polymer/polymer/commit/f7672da9))

- Reference dependencies as siblings in tests. ([commit](https://github.com/Polymer/polymer/commit/2561d868))

- Update types ([commit](https://github.com/Polymer/polymer/commit/23ba7dee))

- Add note about performance vs correctness ([commit](https://github.com/Polymer/polymer/commit/89ab7385))

- Update types. ([commit](https://github.com/Polymer/polymer/commit/5357d64a))

- Lint clean. ([commit](https://github.com/Polymer/polymer/commit/f78b0518))

- Pass through fourth namespace param on attributeChangedCallback. ([commit](https://github.com/Polymer/polymer/commit/91d4aeba))

- Add a @const annotation to help the Closure Compiler understand that Polymer.Debouncer is the name of a type. ([commit](https://github.com/Polymer/polymer/commit/e5a5725d))

- [ci skip] update changelog ([commit](https://github.com/Polymer/polymer/commit/92d282a9))

- Update docs and types ([commit](https://github.com/Polymer/polymer/commit/211c223f))

- Update perf test to use strict-binding-parser ([commit](https://github.com/Polymer/polymer/commit/f53e9e8a))

- Correct import paths ([commit](https://github.com/Polymer/polymer/commit/ab93ab08))

- Only store method once for dynamic functions ([commit](https://github.com/Polymer/polymer/commit/0f0ccdad))

- Move strict-binding-parser to lib/mixins ([commit](https://github.com/Polymer/polymer/commit/a4d4eb9a))

- Rename to StrictBindingParser ([commit](https://github.com/Polymer/polymer/commit/19d4b8cb))

- Fix linter errors ([commit](https://github.com/Polymer/polymer/commit/d8cf449e))

- Extract to a mixin ([commit](https://github.com/Polymer/polymer/commit/57a14236))

- Add missing dependency to bower.json ([commit](https://github.com/Polymer/polymer/commit/333a4664))

- Fix linter warning ([commit](https://github.com/Polymer/polymer/commit/14fac019))

- Add documentation ([commit](https://github.com/Polymer/polymer/commit/df0ee354))

- Add performance test for binding-expressions ([commit](https://github.com/Polymer/polymer/commit/42f7d785))

- Rewrite parser to use switch-case instead of functions ([commit](https://github.com/Polymer/polymer/commit/423074d1))

- Remove escaping from bindings ([commit](https://github.com/Polymer/polymer/commit/8cd49479))

- Fix linter warning ([commit](https://github.com/Polymer/polymer/commit/8a5525b0))

- Refactor to be functional and add more tests ([commit](https://github.com/Polymer/polymer/commit/7eb1a627))

- Fix linter warnings ([commit](https://github.com/Polymer/polymer/commit/79d05b8a))

- Rewrite expression parser to state machine ([commit](https://github.com/Polymer/polymer/commit/13b834df))

