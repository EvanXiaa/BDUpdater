2.0.0
- Introduced a new API to allow instance reuse (#42):
  - Added a `createColors` function that returns an object with all available color functions.
    - Color support is automatically detected, but it can be overridden via the `useColor` boolean property.
  - Introduced a new `isColorSupported` property, which is `true` if the terminal supports color, and `false` otherwise.
  - Removed `options.enabled`.