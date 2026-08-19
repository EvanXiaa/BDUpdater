v6.0.0
- [new] Add rule `anchor-is-valid`. See documentation for configuration options. Thanks @AlmeroSteyn.
- [breaking] `href-no-hash` replaced with `anchor-is-valid` in the recommended and strict configs. Use the `invalidHref` aspect (active by default) in `anchor-is-valid` to continue to apply the behavior provided by `href-no-hash`.
- [breaking] Removed support for ESLint peer dependency at version ^2.10.2.
- [update] The rule `label-has-for` now allows inputs nested in label tags. Previously it was strict about requiring a `for` attribute. Thanks @ignatiusreza and @mjaltamirano.
- [update] New configuration for `interactive-supports-focus`. Recommended and strict configs for now contain a trimmed-down whitelist of roles that will be checked.
- [fix] Incompatibility between node version 4 and 5. Thanks @evilebottnawi.
- [fix] Missing README entry for `media-has-caption`. Thanks @ismail-syed.
- [fix] README updates explaining recommended and strict configs. Thanks @Donaldini.
- [fix] Updated to aria-query@0.7.0, which includes new ARIA 1.1 properties. Previously, the `aria-props` rule incorrectly threw errors for these new properties.