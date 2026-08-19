## 8.0.0
The package has been converted to an ES module and now requires Node 18 or higher. If you need support for Node 16 or below, please use version 7.x.x.

### Breaking changes
- Package has been converted to an ES module
- No longer providing a default export. Use the named exports `replaceInFile` or `replaceInFileSync` instead.
- The `replace.sync` syntax is no longer available. Use the named export `replaceInFileSync` instead.
- The callback API has been removed for asynchronous replacements. Please use promises or `async/await` instead.
- Configuration files provided to the CLI using the `--configFile` flag can now only be JSON.
- To use a custom `fs` implementation, you must now specify `fs` config parameter for the async API, and `fsSync` for the sync API. For the asynchronous APIs, the provided `fs` must provide the `readFile` and `writeFile` methods. For the synchronous APIs, the provided `fsSync` must provide the `readFileSync` and `writeFileSync` methods.
- If a `cwd` parameter is provided, it will no longer be prefixed to each path using basic string concatenation, but rather uses `path.join()` to ensure correct path concatenation.


### New features
- The `isRegex` flag is no longer required.
- You can now specify a `getTargetFile` config param to modify the target file for saving the new file contents to. For example:


```js
const options = {
  files: 'path/to/files/*.html',
  getTargetFile: source => `new/path/${source}`,
  from: 'foo',
  to: 'bar',
}
```

