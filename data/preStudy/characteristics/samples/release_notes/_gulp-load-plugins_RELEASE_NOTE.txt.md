v2.0.8:
- fixes #141 - module.parent deprecated in node 14+. thanks @daveyjake
- update dependencies

if you get the error `cannot read properties of undefined (reading 'filename')`, this is because you're using a version of node where `module.parent` is undefined. to resolve, you need to add `config` to the plugin when instantiated with the path to your `package.json` file to read its dependencies. for example:

```
import gulploadplugins from 'gulp-load-plugins';

const $ = gulploadplugins({
  config: process.env.npm_package_json
});
```