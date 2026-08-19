10.0.0:
### breaking

* dc46bc5 use esm and update `vfile`
  * change:

    ```js
    // from cjs import
    var unified = require('unified')

    // to esm import
    import {unified} from 'unified'
    ```

    learn [more about esm in this guide](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
  * **breaking**: this updates `vfile`, which importantly renames ~~`vfile.contents`~~ to `vfile.value`. see [`vfile@5`](https://github.com/vfile/vfile/releases/tag/5.0.0)
  * inconsequential: this updates `trough`, which removes support for promise-like objects returned from plugins, in favor of only support actual promises. to update, instead of returning an object with a `then` function, return and *actual* promise

### types

* b3e2464 rewrite types
  * removed the type parameter `p` for processor settings
  * use `any[]` instead of `[record<string, unknown>?]` for the default plugin type parameters
* 45eb72e update types for esm
* 2c7ba99 8eda349 add explicit dependency on `@types/unist`
* 0e8f611 remove typescript@3 legacy support
* 350ed9d fix `next` in types of transformer signature
* b22bf8e add support for buffer, other return values
* 4bfd6c8 b8fe5ec 6ef3933 add support for boolean plugin options

### project

* 88374fc add `esast` to list of syntax trees
* a6ff3c1 fix links
* ee6ee47 update examples in `readme.md`
* 32abf7c 60de570 115898a refactor code style
