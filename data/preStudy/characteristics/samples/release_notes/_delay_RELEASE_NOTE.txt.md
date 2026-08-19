v6.0.0
### Breaking

- Require Node.js 16  b2edac7
- This package is now pure ESM. **Please [read this](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).**
- Removed the `delay.reject()` method.
  - It's not really needed anymore with async/await. Just throw an error after awaiting the delay.
- `const delay = require('delay'); delay.clear(…);` → `import {clearDelay} from 'delay'; clearDelay(…);`
- `const delay = require('delay'); delay.range(…);` → `import {rangeDelay} from 'delay'; rangeDelay(…);`
- `const delay = require('delay'); delay.createWithTimers(…);` → `import {createDelay} from 'delay'; createDelay(…);`

If you only target Node.js and not the browser, I recommend moving to the built-in method whenever possible:

```js
import {setTimeout} from 'node:timers/promises';

await setTimeout(1000);
```

https://github.com/sindresorhus/delay/compare/v5.0.0...v6.0.0