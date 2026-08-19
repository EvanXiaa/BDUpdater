v5.0.0
* Remove lodash dependency
* **DROP CALLBACK SUPPORT** - Read the migration guide if you are currently using the callback based api! :warning: 
* add .has(key) and method - Thanks to Regev Brody for PR [#132]!
* add .mset([{key,val,ttl}]) method - Thanks to Sujesh Thekkepatt for PR [#142]!
* add maxKeys setting to limit cache size - Thanks do @daluf for PR [#141]!
* Also, thank you to all other contributors that remain unnamed here! :tada: 

---

## MIGRATION GUIDE :construction: 

We have dropped callback support in node-cache and you should migrate to our sync-style api!

**If you cannot refactor right now**, you can **turn on legacy callback support** by enabling the `enableLegacyCallbacks` option. Eg: `const cache  = new NodeCache({ enableLegacyCallbacks: true })`

But we **strongly recommend to refactor your code to use the sync-api** because we will drop official callback support in Versions v6.x and onwards.

If your code currently looks like this:

```javascript
cache.get("my-key", function(err, value) {
  if (err) {
     // ...
  }

  // double equal checks for null and undefined
  if (value != null) {
    // hmm.... nothing here :(
  }

  // do something with value
});
```

it should be rewritten to:

```javascript
const value = cache.get("my-key");

// double equal checks for null and undefined
if (value != null) {
  // hmm.... nothing here :(
}

// do something with value
```