v2.0.0:
# features

* ship with typings
* add `name` argument to give a hook a name
* add `done`, `result` and `error` intercept points to the `intercept` api

# bugfixes

* avoid stack overflow while series hook compilation
* exclude tests from npm package
* remove duplicate semicolon in generated code
* fixes a stack overflow when adding too many plugins to a sync hook

# performance 

* refactor hooks to reduce number of hidden maps in methods

# deprecations

* remove deprecated tapable class
* deprecate `context` option
* deprecate `tap` etc. for `hookmap`

# internal

* upgrade dev dependencies
* add linting step to ci