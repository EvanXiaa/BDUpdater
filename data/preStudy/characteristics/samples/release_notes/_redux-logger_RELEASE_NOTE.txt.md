3.0.0
## Breaking change
In [2.9.0](https://github.com/evgenyrodionov/redux-logger/releases/tag/2.9.0) we introduced default logger, but this led to problems (#210).

It was so bad that we publish 3 broken versions. So, we decided made a breaking change: by default we now export logger with default options and `createLogger` is now coming as named import.

## TL;DR
You need to change your import
```diff
import { applyMiddleware, createStore } from 'redux'

- import createLogger from 'redux-logger'
+ import { createLogger } from 'redux-logger'
// or
- var createLogger = require('redux-logger')
+ var createLogger = require('redux-logger').createLogger

const logger = createLogger()

const store = createStore(
  reducer,
  applyMiddleware(logger)
)
```

or use logger with default settings
```javascript
import { applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
// or const { logger } = require('redux-logger')

const store = createStore(
  reducer,
  applyMiddleware(logger)
)
```