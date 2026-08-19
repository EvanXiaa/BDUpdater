v3.0.0:
the largest change to documentation.js so far.

**dropping streams**

this a major refactor of the documentation.js interface with a focus on
simplifying the system. up until this point, documentation.js was built around
[node.js streams](https://nodejs.org/api/stream.html), which are low-level
representations of asynchronous series of data. while this abstraction was
appropriate for the input and github streams, which are asynchronous, the
majority of documentation.js's internals are simple and synchronous functions
for which basic functional composition makes more sense than stream
semantics.

documentation 3.0.0 uses simple functional composition for operations like
parmameter inference, rather than streams.

**stronger support for es6, es7, and flow**

we've switched to [babel](https://babeljs.io/) as our source code parser,
which means that we have much broader support of new javascript features,
including import/export syntax and new features in es6.

babel also parses [flow type annotations](http://flowtype.org/docs/type-annotations.html),
and new inference code means that we can infer
- parameter names & types
- return types

without any explicit jsdoc tags. this means that for many simple functions,
we can generate great documentation with less writing.

**stronger module support**

documentation.js now has much better inference for membership and names of symbols
exported via `exports` or `module.exports`.

**support for nested symbols**

the parent/child relationship between symbols is now fully hierarchical, and
symbols can be nested to any depth. for instance:

```
/**
 * a global parent class.
 */
var parent = function () {};

/**
 * a child class.
 */
parent.child = function () {};

/**
 * a grandchild class.
 */
parent.child.grandchild = function () {};
```

in addition, filtering by access is now applied to the entire hierarchy: if you
mark a class as `@private`, neither it nor its children will be included in the
output by default, regardless of the access specifiers of the children.

**mdast-based markdown output**

we've switched from templating markdown output with [handlebars.js](http://handlebarsjs.com/)
to generating an [abstract syntax tree](https://en.wikipedia.org/wiki/abstract_syntax_tree)
of desired output and stringifying it with [mdast](https://github.com/wooorm/mdast).
this lets documentation.js output complex markdown without having to worry
about escaping and properly formatting certain elements.

**test coverage 100%**

documentation.js returns to 100% test coverage, so every single line
of code is covered by our large library of text fixtures and specific tests.

**--lint mode**

specifying the `--lint` flag makes documentation.js check for non-standard
types, like `string`, or missing namespaces. if the encountered files have
any problems, it pretty-prints helpful debug messages and exits with status 1,
and otherwise exits with no output and status 0.

**breaking changes**
- the `--version` flag is now `--project-version`. `--version` now outputs
  documentation.js's version

v4.0.0-beta:
**revitalized documentation.js command line interface!**

the `documentation` utility now takes commands:
- `documentation build` extracts and formats documentation
- `documentation serve` provides an auto-reloading server ([#236](https://github.com/documentationjs/documentation/pull/236))
- `documentation lint` reviews files for inconsistencies
- `documentation readme` patches api documentation into a readme ([#313](https://github.com/documentationjs/documentation/pull/313) by @anandthakker)

this functionality was previously included in `dev-documentation` and has
been folded into `documentation` proper.

**much more flexible themes**

themes are now much more customizable. in documentation.js 3.x and before, themes
were required to use handlebars templates and produce a single page. in
documentation.js 4.x and beyond, they are javascript modules that can use
any template engine and produce any number of files. see the
[new theme documentation](https://github.com/documentationjs/documentation/blob/master/docs/theming.md) for
details.

**more precise traversal**

inference in 4.x is stricter than in 3.x: comments must be adjacent
to the statements they document. this should make documentation generation
much more predictable.

**support for the revealing module pattern**

``` js
/** foo */
function foo() {
  /** test */
  function bar() {}
  return {
    bar: bar
  };
}
```

new support for the [javascript module pattern](http://www.macwright.org/2012/06/04/the-module-pattern.html)!
this was implemented in [#324](https://github.com/documentationjs/documentation/pull/324)
by [charlie brown](https://github.com/carbonrobot).

**breaking changes**
- documentation.js now follows the [jsdoc standard's interpretation of the @name tag](http://usejsdoc.org/tags-name.html):
  specifying a name tag will turn off inference. if you still want inference
  but want to call code something else, use the [@alias tag](http://usejsdoc.org/tags-alias.html) instead.
