v5.0.0:
### breaking

- require node.js 18  23d61ba

as a reminder, this package continues to [require esm](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). for typescript users, this includes having [`"module": "node16", "moduleresolution": "node16"` in your tsconfig](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#how-can-i-make-my-typescript-project-output-esm).

### fixes

- fix asyncresource propagation issue (#71)  ad8afe6

https://github.com/sindresorhus/p-limit/compare/v4.0.0...v5.0.0