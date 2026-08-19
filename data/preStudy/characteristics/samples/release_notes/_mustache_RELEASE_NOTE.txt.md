v3.0.0:
## [3.0.0] / 16 september 2018

we are very happy to announce a new major version of mustache.js. we want to be very careful not to break projects out in the wild, and adhering to [semantic versioning](http://semver.org/) we have therefore cut this new major version.

the changes introduced will likely not require any actions for most using projects. the things to look out 
for that might cause unexpected rendering results are described in the migration guide below.

a big shout out and thanks to [@raymond-lam] for this release! without his contributions with code and
issue triaging, this release would never have happened.

### major

* [#618]: allow rendering properties of primitive types that are not objects, by [@raymond-lam].
* [#643]: `writer.prototype.parse` to cache by tags in addition to template string, by [@raymond-lam].
* [#664]: fix `writer.prototype.parse` cache, by [@seminaoki].

### minor

* [#673]: add `tags` parameter to `mustache.render()`, by [@raymond-lam].

### migrating from mustache.js v2.x to v3.x

#### rendering properties of primitive types

we have ensured properties of primitive types can be rendered at all times. that means `array.length`, `string.length` and similar. a corner case where this could cause unexpected output follows:

view:
```
{
  stooges: [
    { name: "moe" },
    { name: "larry" },
    { name: "curly" }
  ]
}
```

template:
```
{{#stooges}}
  {{name}}: {{name.length}} characters
{{/stooges}}
```

output with v3.0:
```
  moe: 3 characters
  larry: 5 characters
  curly: 5 characters
```

output with v2.x:
```
  moe:  characters
  larry:  characters
  curly:  characters
```

#### caching for templates with custom delimiters

we have improved the templates cache to ensure custom delimiters are taken into consideration for the
cache. this improvement might cause unexpected rendering behaviour for using projects actively using the custom delimiters functionality.

previously it was possible to use `mustache.parse()` as a means to set global custom delimiters. if custom
delimiters were provided as an argument, it would affect all following calls to `mustache.render()`.
consider the following:

```js
const template = "[[item.title]] [[item.value]]";
mustache.parse(template, ["[[", "]]"]);

console.log(
  mustache.render(template, {
    item: {
      title: "test",
      value: 1
    }
  })
);

>> test 1
```

the above illustrates the fact that `mustache.parse()` made mustache.js cache the template without
considering the custom delimiters provided. this is no longer true.

we no longer encourage using `mustache.parse()` for this purpose, but have rather added a fourth argument to `mustache.render()` letting you provide custom delimiters when rendering.

if you still need the pre-parse the template and use custom delimiters at the same time, ensure to provide
the custom delimiters as argument to `mustache.render()` as well.

[#618]: https://github.com/janl/mustache.js/issues/618
[#643]: https://github.com/janl/mustache.js/issues/643
[#664]: https://github.com/janl/mustache.js/issues/664
[#673]: https://github.com/janl/mustache.js/issues/673

[@raymond-lam]: https://github.com/raymond-lam
[@seminaoki]: https://github.com/seminaoki

[3.0.0]: https://github.com/janl/mustache.js/compare/v2.3.2...v3.0.0