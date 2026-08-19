v5.0.0-beta.0
# Bugfixes

* fixes lowercase file letters
* fixes `"main": "."` crash

# Features

* increase minimal node.js version
* update dependencies
* remove memory-fs dependency
* real fs is usable, no `join` expected from filesystem
* track dependencies while resolving
* add support for arrays in alias
* add support for Yarn PnP

# Removals

* remove concord
* remove deprecated tapable compat layer 
* remove .context and .loader from node API
* remove NodeJsInputFileSystem

# Contribution

* refactor join and normalize to use node.js path instead of memory-fs
* linting update
* code style update (spread operator, let/const, arrow functions)

# Performance

* optimize number of fs accesses
* serialize all operations to reduce number of fs accesses
