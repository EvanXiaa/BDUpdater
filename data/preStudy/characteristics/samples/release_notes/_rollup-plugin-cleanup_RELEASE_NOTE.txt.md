v3.0.0
Add an example of using Acorn plugin the README.
New option acornOptions, for advanced usage.
This is an optional, plain JS object with additional settings passed to the Acorn parser. Properties of this object are merged with, and take precedence over, the existing ecmaVersion and sourceType options.
The mimimum node version is now 6.14, for compatibility with ESLint 5.
Updated devDependencies.