v1.0.0
We're happy to announce that Stitches v1.0.0 has been released. This version is the stable release and comes with lots of performance improvements and bug fixes.

Please refer to [migration guide](https://stitches.dev/blog/migrating-from-beta-to-v1) and [changelog](https://stitches.dev/blog/stitches-1.0.0).


### Breaking Changes

- Renamed `createCss` to `createStitches`
- Renamed `global` to `globalCss`
- Renamed `getCssString` to `getCssText`
- Moved creator function from `theme` to `createTheme`
- Renamed TypeScript `StitchesCss` to `CSS`
- Renamed TypeScript `StitchesVariants` to `VariantProps`

### Bug fixes and improvements

- #683: 1.0 - Rename global to globalCss
- #696: Prevent as prop to be used as a variant
- #732: Make theme.className inject styles
- #681: TS:1.0 - VariantProps returns any
- #655: min/max width fit-content is unable to render
- #680: TS:1.0 - CSS should also work in an unconfigured way
- #678: TS:1.0 - Error extending a CSS fragment
- #660: TypeScript prevents use of animationName inside styled
- #602: TypeScript: Typing of util errors inside variants
- #560: Argument types not being inferred in event handler props when composing components
- #518: All CSS Properties cause TS errors when using css function from createCss
- #530: Typescript error when composing components with boolean variants
- #512: Tokens aren't included in the theme type definition
- #506: Typescript Error when passing css prop to styled component
- #497: Running typescript compiler on project with …s fails to compile (tried with multiple builders)
- #484: Allow utils in themeMap for ease of typing for a more generic typing
- #453: Types disappear when I destructure config from createCss
- #427: [0.1.0-canary.7+] TS error when passing react-router's Link to "as" prop
- #407: TS: error spreading abstracted style onto css prop
- #405: TypeError when passing a style object with default variants or of type CSS
- #383: Brainstorm how to abstract utils
- #378: [stitches/react] css prop is not autocompleting tokens
- #736: TS:1.0 - Stitches.PropertyValue error with string
- #735: TS:1.0 - font weight error
- #715: Incorrect typing for css prop on Canary
- #726: TS:1.0 - zIndex error with string
- #720: Type regression using as and css on a Stitches component on Canary 7
- #719: Type regression for targeting a Stitches component in Canary
- #702: TS:1.0 - Error types spreading StitchesCss fragments
- #706: TS:1.0 - Error when accessing .className and .selector
- #705: TS:1.0 - nested pseudo classes in media throws error
- #718: TS:1.0 - Suggestions should not include @all
- #712: Incorrect typings for styled inputs on Canary
- #707: TS:1.0 - PropertyValue missing number
- #697: TS:1.0 - css type is {} when using React.ComponentProps
- #670: styled API: 1st arg must be a type, then infinite style objects
- #682: 1.0 - Rename createCss to createStitches
- #679: TS:1.0 - Performance issue when exposing css prop from custom Component
- #727: TS:1.0 - Complex TS error
- #684: 1.0 - Add createTheme to main export
- #685: 1.0 - Remove theme creation from theme and into its own function
- #713: TS:1.0 - createTheme return type does not include ThemeTokens when theme class is used
- #716: TS:1.0 - Expression produces a union type that is too complex to represent
- #653: Latest Stitches does not work well with next-themes
- #666: Locally Scoped Tokens should ignore undefined values