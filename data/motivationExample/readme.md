### The motivation example in Section 2

the code snippet `example.js` comes from [ask-cli]("https://github.com/alexa/ask-cli/blob/v2.0.0/lib/clients/smapi-client/index.js").
The code is affected by the breaking change of doWhilst, where the second parameter should be a callback style function with proper inputs.

```javascript
async.doWhilst(
            (loopCallback) => {
                smapiMethod(...callArgv, queryParams, (err, res) => {
                    if (err) {
                        return loopCallback(err, null);
                    }
                    if (res.statusCode >= 300) {
                        // TODO stringify the body
                        return loopCallback(res.body, null);
                    }
                    const parseResult = responseHandle(res);
                    queryParams.nextToken = parseResult.nextToken;
                    result[responseAccessor] = result[responseAccessor].concat(parseResult.listResult);
                    loopCallback(null, result);
                });
            },
            () => queryParams.nextToken,
            (err, res) => callback(err, err ? null : res)
        );
```

### LLM trying to migrate the Async API to v3 (without knowlegde):
Merely relying on LLM's knowledge results in wrong analysis and migration.

```aiignore
So, to summarize:
- It is OK if queryParams.nextToken is falsey when the loop needs to finish.
- Your current test function works as synchronous (returns a value which is fine for a doWhilst loop).
- If queryParams.nextToken can be a value that's truthy, then your code is mostly compatible, but for clarity, you should return an explicit boolean.

Here is a recommended rewrite (with explanations as annotation):

```js
// Updated for async v3.x
async.doWhilst(
    (loopCallback) => {
        smapiMethod(...callArgv, queryParams, (err, res) => {
            if (err) {
                return loopCallback(err, null);
            }
            if (res.statusCode >= 300) {
                // TODO stringify the body
                return loopCallback(res.body, null);
            }
            const parseResult = responseHandle(res);
            queryParams.nextToken = parseResult.nextToken;
            result[responseAccessor] = result[responseAccessor].concat(parseResult.listResult);
            loopCallback(null, result);
        });
    },
    // The test function (second parameter) should explicitly return a Boolean in async v3.x,
    // instead of relying on truthiness of 'nextToken'.
    // This makes upgrading easier to maintain and less error-prone.
    () => Boolean(queryParams.nextToken),
    (err, res) => callback(err, err ? null : res)
);
```


### LLM trying to migrate the Async API to v3 (with changelog):
Here the root cause of the breaking change is correct, however, the parameter is misused due to the lack of adapation example

```aiignore
**Explanation:**
In async v2.x, the test function could be synchronous: () => queryParams.nextToken.

In async v3.x, the test function is async and must:
- Take a callback as the first argument (testCallback).
- Call that callback with (err, BooleanValue).

async.doWhilst(
    (loopCallback) => {
        smapiMethod(...callArgv, queryParams, (err, res) => {
            if (err) {
                return loopCallback(err, null);
            }
            if (res.statusCode >= 300) {
                // TODO stringify the body
                return loopCallback(res.body, null);
            }
            const parseResult = responseHandle(res);
            queryParams.nextToken = parseResult.nextToken;
            result[responseAccessor] = result[responseAccessor].concat(parseResult.listResult);
            loopCallback(null, result);
        });
    },
    // Changed to asynchronous for async v3+
    (testCallback) => {
        testCallback(null, queryParams.nextToken);
    },
    (err, res) => callback(err, err ? null : res)
);
```

### LLM trying to migrate the Async API to v3 (with fine-grained breaking change facts):


```aiignore
fine-grained breaking change facts mined by BDUpdater: knowledge from changelog, github issues, and test examples.
    {
      "Id": 4,
      "BC_description": "The methods 'async.during' and 'async.doDuring' have been removed from the API. All direct calls to 'async.during' or 'async.doDuring' will now fail. Additionally, the methods 'async.whilst', 'async.doWhilst', 'async.until', and 'async.doUntil' now require their 'test' argument to be asynchronous, instead of synchronous. Synchronous 'test' functions will no longer work \u2014 the 'test' function must now accept a callback (or be async/await). For 'whilst' and 'until', refactor the 'test' function to the asynchronous style ((callback) => callback(null, condition)). For 'doWhilst' and 'doUntil', the 'test' function now receives the iteratee's results followed by a callback ((value, callback) => callback(null, condition)). Direct replacement is required for all uses of these APIs with synchronous 'test' arguments. Remove or migrate all usage, import, or export of 'async.during' and 'async.doDuring'.",
      "Reference": [
        "#850",
        "#1557"
      ],
      "Changed_object": {
        "type": "call",
        "className": [
          "async"
        ],
        "methodName": [
          "during",
          "doDuring",
          "whilst",
          "doWhilst",
          "until",
          "doUntil"
        ],
        "propertyName": [],
        "moduleName": []
      },
      "Adaptation_method": "1. Replace all 'async.during' calls with 'async.whilst', rewriting the 'test' argument as an asynchronous function ((callback) => callback(null, condition)).\n2. Replace all 'async.doDuring' calls with 'async.doWhilst', modifying the 'test' argument to be asynchronous ((...args, callback) => callback(null, condition)).\n3. For all usages of 'async.whilst' and 'async.until', refactor the 'test' argument from a synchronous function to an asynchronous function that accepts a callback: Before: async.whilst(() => condition, ...) After: async.whilst((cb) => cb(null, condition), ...)\n4. For usages of 'async.doWhilst' and 'async.doUntil', the 'test' function now must be asynchronous and accept results of the iteratee plus a callback as final argument: Before: async.doWhilst(iteratee, (value) => value < 5, done) After: async.doWhilst(iteratee, (value, cb) => cb(null, value < 5), done)\nNo synchronous 'test' functions are allowed. Update all test functions accordingly.",
      "RequireInfoFlag": false,
      "RequireInfo": ""
    }


the adapted code:

        async.doWhilst(
            (loopCallback) => {
                smapiMethod(...callArgv, queryParams, (err, res) => {
                    if (err) {
                        return loopCallback(err, null);
                    }
                    if (res.statusCode >= 300) {
                        // TODO stringify the body
                        return loopCallback(res.body, null);
                    }
                    const parseResult = responseHandle(res);
                    queryParams.nextToken = parseResult.nextToken;
                    result[responseAccessor] = result[responseAccessor].concat(parseResult.listResult);
                    loopCallback(null, result);
                });
            },
            (value, cb) => cb(null, queryParams.nextToken), // Refactored: test argument is now asynchronous as required in async v3.x
            (err, res) => callback(err, err ? null : res)
        );
    }
```