v1.4.1:
<a name"1.4.1"></a>

### 1.4.1 (2016-12-06)

#### bug fixes
- removed yarn.lock from npm ([226c01c5](https://github.com/adriantoine/enzyme-to-json/commit/226c01c5))

v3.0.0:
there it is, a new major version!

# features

- works with enzyme v3 and react 16
- support top level array components (new in react 16)
- remove mounttoshallowjson and mounttodeepjson and use options instead
- simplified readme
- refactor documentation
- typescript bindings


# breaking changes

- components returning `null` or [any falsy value](https://developer.mozilla.org/en-us/docs/glossary/falsy) are now rendered as an empty string in snapshots instead of `null`

- shallow wrapper are now outputting `undefined` props:
```diff
  <basicwithundefined>
-   <button>
+   <button
+     disabled={undefined}
+   >
      hello
    </button>
  </basicwithundefined>
```

- [this use case](https://github.com/adriantoine/enzyme-to-json/blob/master/tests/core/shallow.test.js#l127-l141) won't be supported anymore, it seems incorrect anyway to pass `this` as a prop and i can see no usage of this in the `react-bootstrap` documentation anyway

- [this use case](https://github.com/adriantoine/enzyme-to-json/blob/master/tests/core/shallow.test.js#l147-l154) won't be supported either as it doesn't seem to be supported by enzyme either, you will just have to use their `simulate` helper to do that

- `mounttoshallowjson` and `mounttodeepjson` are replaced by a `mode` option in `mounttojson`:

```js
mounttoshallowjson(wrapper);
// ==>
mounttojson(wrapper, {mode: 'shallow'});

mounttodeepjson(wrapper);
// ==>
mounttojson(wrapper, {mode: 'deep'});
```

# bugs

please report any bugs in [the github issues tab](https://github.com/adriantoine/enzyme-to-json/issues) as soon as you find them. thanks!