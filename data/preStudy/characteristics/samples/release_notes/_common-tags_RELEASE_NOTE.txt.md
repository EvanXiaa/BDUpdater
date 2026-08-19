v2.0.0-alpha.1
**This is a pre-release. Please help the development of common-tags by testing the common-tags@next version.**

Version 2.0.0 is coming. Before it is released however, there are some things to be done - eg. the documentation needs to be rewritten properly for clarity. Maybe the package will be also rewritten into TypeScript? Who knows.

### Breaking changes

- `TemplateTag` no longer detects whether the argument is a function and subsequently calls it. This may have been a bit convenient, but at the cost of code clarity, and it was also adding extra complication to the core function that should be as lean as possible: (https://github.com/declandewet/common-tags/commit/0c1c971e59a41fb65a41971537fdbe0cf05ab7a6)
- Arguments in transformers are now checked on initialization as opposed to inside the hooks. This makes errors detectable earlier (https://github.com/declandewet/common-tags/commit/1811baa8f105a1dfda0ee5e1c88ce491509ed60a)

### New stuff

- `createTag` is introduced as a replacement for `TemplateTag`. The days of adding `new` each time you want to combine some tags are over (https://github.com/declandewet/common-tags/commit/74d10765ea1693a256c1eeadeca355c4f90734e2)
- Each of the hooks (`onString`, `onSubstitution`, `onEndResult`) now gets and additional argument: `context`. You can initialize its value in the new `getInitialContext` hook. This replaces the previously suggested practice of doing something like assigning to `this` in a hook. For more insight I recommend reading the tests in the linked commit (https://github.com/declandewet/common-tags/commit/c17c2f02e016c0da79755fbf2279980ad9c8b5a2)
- A new tag is added: `id`. It just returns whatever it receives. Again, for more examples for now look into tests in the following commit (https://github.com/declandewet/common-tags/commit/52120bb72007d3afd7c16bdec2c6b166c561e71b)
- Tags are now composable; previously this feat was impossible, as tags are functions and would've just been called. After the breaking change you can stuff other tags inside `createTag` without a problem (https://github.com/declandewet/common-tags/commit/e3931951c211c475ea54b204a0b54c9c81554b6f)
- Smart trimming was introduced as a remedy to a long-standing issue and is now used in `stripIndent` and `stripIndents` (https://github.com/declandewet/common-tags/pull/165)
- Nesting code inside other code when using `html` (aka `source aka `codeBlock`) should not cause nasty surprises anymore (https://github.com/declandewet/common-tags/pull/182)

### Deprecations

- As a result of the introduction of `createTag`, `TemplateTag` is now soft-deprecated. That means you can still use it, but it will print a helpful message that will guide you to the new API (https://github.com/declandewet/common-tags/commit/3ad194684f8e3358a6c042a066da9db745518ac0)