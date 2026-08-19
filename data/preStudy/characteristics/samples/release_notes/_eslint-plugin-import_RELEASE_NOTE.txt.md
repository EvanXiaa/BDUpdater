v0.4.0:
- removed `no-common` in favor of enforcing that all imports have es6 modules behind them. (#20)
- `resolve.root` setting allows module resolution to start from some arbitrary path within your package, instead of just relative paths and `node_modules`. (#18)

v1.0.0:
- `import/namespace`: support deep namespaces #119 via #157 
- `import/no-deprecated`: wip rule to let you know at lint time if you're using deprecated functions, constants, classes, or modules.

from the beta 1.0 release notes:

update, verified to work with eslint 2.0.

"breaking" changes from 0.13.0:

no longer needs/refers to import/parser or import/parse-options. instead, eslint provided the configured parser + options to the rules, and they use that to parse dependencies.

shouldn't hurt to leave it there, and i suspect 99.999% of installs have import/parser === parser.

this also means the plugin uses espree instead of babylon if no parser is configured. wouldn't expect this to hurt in general, but it is a potentially breaking difference.

eslint-config-import is no longer supported. instead, use the shared configs directly exported by the plugin. see the readme for details.

nothing groundbreaking, but import/parser has been a thorny issue for the whole life of the plugin, and i'm glad to finally be rid of it. :sweat_smile:
