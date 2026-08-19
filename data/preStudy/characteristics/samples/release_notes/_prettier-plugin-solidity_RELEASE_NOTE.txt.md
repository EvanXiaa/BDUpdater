v2.0.0:
this is a **new major version** of prettier plugin solidity.

the changes from v1 are minimal, but there are a couple of breaking changes.

the plugin now uses [slang](https://nomicfoundation.github.io/slang) as the parser by default. slang is a more powerful and correct parser that improves formatting in many edge cases—especially when comments are involved.

if you had the parser explicitly set in your `.prettierrc` (e.g., "parser": "solidity-parse"), you'll need to update it to:
```
"parser": "slang"
```

if you don't have the parser option set in your config, no action is needed.

the old antlr-based parser is still supported in v2, but it's **deprecated** and will be removed in the next major version.