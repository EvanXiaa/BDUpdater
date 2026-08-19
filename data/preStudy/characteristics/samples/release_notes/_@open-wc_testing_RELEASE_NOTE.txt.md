@open-wc/testing@4.0.0
Major Changes

Updated dependencies [c69af75]
@open-wc/testing-helpers@3.0.0
If you're using a fixture like so with scoped elements:

await fixture(html`...`, { scopedElements: ... });
You're gonna have to load the @webcomponents/scoped-custom-element-registry polyfill yourself first.