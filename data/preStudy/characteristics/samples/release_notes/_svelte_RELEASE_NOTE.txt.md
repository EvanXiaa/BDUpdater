svelte@4.0.0

Major Changes

breaking: Minimum supported Node version is now Node 16 (#8566)

breaking: Minimum supported webpack version is now webpack 5 (#8515)

breaking: Bundlers must specify the browser condition when building a frontend bundle for the browser (#8516)

breaking: Minimum supported vite-plugin-svelte version is now 2.4.1. SvelteKit users can upgrade to 1.20.0 or newer to ensure a compatible version (#8516)

breaking: Minimum supported rollup-plugin-svelte version is now 7.1.5 (198dbcf)

breaking: Minimum supported svelte-loader is now 3.1.8 (198dbcf)

breaking: Minimum supported TypeScript version is now TypeScript 5 (it will likely work with lower versions, but we make no guarantees about that) (#8488)

breaking: Remove svelte/register hook, CJS runtime version and CJS compiler output (#8613)

breaking: Stricter types for createEventDispatcher (see PR for migration instructions) (#7224)

breaking: Stricter types for Action and ActionReturn (see PR for migration instructions) (#7442)

breaking: Stricter types for onMount - now throws a type error when returning a function asynchronously to catch potential mistakes around callback functions
(see PR for migration instructions) (#8136)

breaking: Overhaul and drastically improve creating custom elements with Svelte (see PR for list of changes and migration instructions) ([#8457](https://github.
com//pull/8457))

breaking: Deprecate SvelteComponentTyped in favor of SvelteComponent (#8512)

breaking: Make transitions local by default to prevent confusion around page navigations (#6686)

breaking: Error on falsy values instead of stores passed to derived (#7947)

breaking: Custom store implementers now need to pass an update function additionally to the set function ([#6750](https://github.com/sveltejs/svelte/pull/
6750))

breaking: Do not expose default slot bindings to named slots and vice versa (#6049)

breaking: Change order in which preprocessors are applied (#8618)

breaking: The runtime now makes use of classList.toggle(name, boolean) which does not work in very old browsers ([#8629](https://github.com/sveltejs/svelte/
pull/8629))

breaking: apply inert to outroing elements (#8628)

breaking: use CustomEvent constructor instead of deprecated createEvent method (#8775)

Minor Changes

Add a way to modify attributes for script/style preprocessors (#8618)

Improve hydration speed by adding data-svelte-h attribute to detect unchanged HTML elements (#7426)

Add a11y no-noninteractive-element-interactions rule (#8391)

Add a11y-no-static-element-interactionsrule (#8251)

Allow #each to iterate over iterables like Set, Map etc (#7425)

Improve duplicate key error for keyed each blocks (#8411)

Warn about : in attributes and props to prevent ambiguity with Svelte directives (#6823)

feat: add version info to window. You can opt out by setting discloseVersion to false in the compiler options (#8761)

feat: smaller minified output for destructor chunks (#8763)

Patch Changes

Bind null option and input values consistently (#8312)

Allow $store to be used with changing values including nullish values (#7555)

Initialize stylesheet with /* empty */ to enable setting CSP directive that also works in Safari (#7800)

Treat slots as if they don't exist when using CSS adjacent and general sibling combinators (#8284)

Fix transitions so that they don't require a style-src 'unsafe-inline' Content Security Policy (CSP) (#6662).

Explicitly disallow var declarations extending the reactive statement scope (#6800)

Improve error message when trying to use animate: directives on inline components (#8641)

fix: export ComponentType from svelte entrypoint (#8578)

fix: never use html optimization for mustache tags in hydration mode (#8744)

fix: derived store types (#8578)

Generate type declarations with dts-buddy (#8578)

fix: ensure types are loaded with all TS settings (#8721)

fix: account for preprocessor source maps when calculating meta info (#8778)

chore: deindent cjs output for compiler (#8785)

warn on boolean compilerOptions.css (#8710)

fix: export correct SvelteComponent type (#8721)