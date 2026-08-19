v6.0.0:
many breaking changes, so it's a new major release. but you don't need to upgrade to v6 if it's unnecessary for you :p

## new features

### support brackets in arguments

i.e. it works like commander.js now:

```js
const cli = require('cac')()

cli.command('build <entry> [...more]')
.option('--target [target]', 'build target', { default: 'web' })
.action((entry, more, options) => {
	console.log(entry, more, options)
})

cli.parse()
```

### options now can be used before command

```bash
node cli.js build --minimize
# equals to
node cli.js --minimize build
``` 

### smaller size

13kb in total, compiled file is about 400 sloc, only one single tiny dependency.

### more

check out [readme](https://github.com/cacjs/cac)

## notable breaking changes

- unknown options are not allowed by default.
- `--help` and `--version` are not added by default.