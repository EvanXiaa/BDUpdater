v2.0.0
Lots of changes here!

First and foremost, we have a slick new [site for docs](https://caolan.github.io/async/). Special thanks to [**@hargasinski**](https://github.com/hargasinski) for his work converting our old docs to `jsdoc` format and implementing the new website. Also huge ups to [**@ivanseidel**](https://github.com/ivanseidel) for designing our new logo. It was a long process for both of these tasks, but I think these changes turned out extraordinary well.

The biggest feature is modularization. You can now `require("async/series")` to only require the `series` function. Every Async library function is available this way. You still can `require("async")` to require the entire library, like you could do before.

We also provide Async as a collection of ES2015 modules. You can now `import {each} from 'async-es'` or `import waterfall from 'async-es/waterfall'`. If you are using only a few Async functions, and are using a ES bundler such as Rollup, this can significantly lower your build size.

Major thanks to [**@Kikobeats**](github.com/Kikobeats), [**@aearly**](github.com/aearly) and [**@megawac**](github.com/megawac) for doing the majority of the modularization work, as well as [**@jdalton**](github.com/jdalton) and [**@Rich-Harris**](github.com/Rich-Harris) for advisory work on the general modularization strategy.

Another one of the general themes of the 2.0 release is standardization of what an "async" function is. We are now more strictly following the node-style continuation passing style. That is, an async function is a function that:

1. Takes a variable number of arguments
2. The last argument is always a callback
3. The callback can accept any number of arguments
4. The first argument passed to the callback will be treated as an error result, if the argument is truthy
5. Any number of result arguments can be passed after the "error" argument
6. The callback is called once and exactly once, either on the same tick or later tick of the JavaScript event loop.

There were several cases where Async accepted some functions that did not strictly have these properties, most notably `auto`, `every`, `some`, and `filter`.

Another theme is performance. We have eliminated internal deferrals in all cases where they make sense. For example, in `waterfall` and `auto`, there was a `setImmediate` between each task -- these deferrals have been removed. A `setImmediate` call can add up to 1ms of delay. This might not seem like a lot, but it can add up if you are using many Async functions in the course of processing a HTTP request, for example. Nearly all asynchronous functions that do I/O already have some sort of deferral built in, so the extra deferral is unnecessary. The trade-off of this change is removing our built-in stack-overflow defense. Many synchronous callback calls in series can quickly overflow the JS call stack. If you do have a function that is sometimes synchronous (calling its callback on the same tick), and are running into stack overflows, wrap it with `async.ensureAsync()`.

Another big performance win has been re-implementing `queue`, `cargo`, and `priorityQueue` with [doubly linked lists](https://en.wikipedia.org/wiki/Doubly_linked_list) instead of arrays. This has lead to queues being an order of [magnitude faster on large sets of tasks](https://github.com/caolan/async/pull/1205).

## New Features

- Async is now modularized. Individual functions can be `require()`d from the main package. (`require('async/auto')`) ([#984](https://github.com/caolan/async/issues/984), [#996](https://github.com/caolan/async/issues/996))
- Async is also available as a collection of ES2015 modules in the new `async-es` package. (`import {forEachSeries} from 'async-es'`) ([#984](https://github.com/caolan/async/issues/984), [#996](https://github.com/caolan/async/issues/996))
- Added `race`, analogous to `Promise.race()`. It will run an array of async tasks in parallel and will call its callback with the result of the first task to respond. ([#568](https://github.com/caolan/async/issues/568), [#1038](https://github.com/caolan/async/issues/1038))
- Collection methods now accept ES2015 iterators.  Maps, Sets, and anything that implements the iterator spec can now be passed directly to `each`, `map`, `parallel`, etc.. ([#579](https://github.com/caolan/async/issues/579), [#839](https://github.com/caolan/async/issues/839), [#1074](https://github.com/caolan/async/issues/1074))
- Added `mapValues`, for mapping over the properties of an object and returning an object with the same keys. ([#1157](https://github.com/caolan/async/issues/1157), [#1177](https://github.com/caolan/async/issues/1177))
- Added `timeout`, a wrapper for an async function that will make the task time-out after the specified time. ([#1007](https://github.com/caolan/async/issues/1007), [#1027](https://github.com/caolan/async/issues/1027))
- Added `reflect` and `reflectAll`, analagous to [`Promise.reflect()`](http://bluebirdjs.com/docs/api/reflect.html), a wrapper for async tasks that always succeeds, by gathering results and errors into an object.  ([#942](https://github.com/caolan/async/issues/942), [#1012](https://github.com/caolan/async/issues/1012), [#1095](https://github.com/caolan/async/issues/1095))
- `constant` supports dynamic arguments -- it will now always use its last argument as the callback. ([#1016](https://github.com/caolan/async/issues/1016), [#1052](https://github.com/caolan/async/issues/1052))
- `setImmediate` and `nextTick` now support arguments to partially apply to the deferred function, like the node-native versions do. ([#940](https://github.com/caolan/async/issues/940), [#1053](https://github.com/caolan/async/issues/1053))
- `auto` now supports resolving cyclic dependencies using [Kahn's algorithm](https://en.wikipedia.org/wiki/Topological_sorting#Kahn.27s_algorithm) ([#1140](https://github.com/caolan/async/issues/1140)).
- Added `autoInject`, a relative of `auto` that automatically spreads a task's dependencies as arguments to the task function. ([#608](https://github.com/caolan/async/issues/608), [#1055](https://github.com/caolan/async/issues/1055), [#1099](https://github.com/caolan/async/issues/1099), [#1100](https://github.com/caolan/async/issues/1100))
- You can now limit the concurrency of `auto` tasks. ([#635](https://github.com/caolan/async/issues/635), [#637](https://github.com/caolan/async/issues/637))
- Added `retryable`, a relative of `retry` that wraps an async function, making it retry when called. ([#1058](https://github.com/caolan/async/issues/1058))
- `retry` now supports specifying a function that determines the next time interval, useful for exponential backoff, logging and other retry strategies. ([#1161](https://github.com/caolan/async/issues/1161))
- `retry` will now pass all of the arguments the task function was resolved with to the callback ([#1231](https://github.com/caolan/async/issues/1231)).
- Added `q.unsaturated` -- callback called when a `queue`'s number of running workers falls below a threshold. ([#868](https://github.com/caolan/async/issues/868), [#1030](https://github.com/caolan/async/issues/1030), [#1033](https://github.com/caolan/async/issues/1033), [#1034](https://github.com/caolan/async/issues/1034))
- Added `q.error` -- a callback called whenever a `queue` task calls its callback with an error. ([#1170](https://github.com/caolan/async/issues/1170))
- `applyEach` and `applyEachSeries` now pass results to the final callback. ([#1088](https://github.com/caolan/async/issues/1088))

## Breaking changes

- Calling a callback more than once is considered an error, and an error will be thrown. This had an explicit breaking change in `waterfall`. If you were relying on this behavior, you should more accurately represent your control flow as an event emitter or stream. ([#814](https://github.com/caolan/async/issues/814), [#815](https://github.com/caolan/async/issues/815), [#1048](https://github.com/caolan/async/issues/1048), [#1050](https://github.com/caolan/async/issues/1050))
- `auto` task functions now always take the callback as the last argument. If a task has dependencies, the `results` object will be passed as the first argument. To migrate old task functions, wrap them with [`_.flip`](https://lodash.com/docs#flip) ([#1036](https://github.com/caolan/async/issues/1036), [#1042](https://github.com/caolan/async/issues/1042))
- Internal `setImmediate` calls have been refactored away. This may make existing flows vulnerable to stack overflows if you use many synchronous functions in series. Use `ensureAsync` to work around this. ([#696](https://github.com/caolan/async/issues/696), [#704](https://github.com/caolan/async/issues/704), [#1049](https://github.com/caolan/async/issues/1049), [#1050](https://github.com/caolan/async/issues/1050))
- `map` used to return an object when iterating over an object.  `map` now always returns an array, like in other libraries.  The previous object behavior has been split out into `mapValues`. ([#1157](https://github.com/caolan/async/issues/1157), [#1177](https://github.com/caolan/async/issues/1177))
- `filter`, `reject`, `some`, `every`, and related functions now expect an error as the first callback argument, rather than just a simple boolean. Pass `null` as the first argument, or use `fs.access` instead of `fs.exists`. ([#118](https://github.com/caolan/async/issues/118), [#774](https://github.com/caolan/async/issues/774), [#1028](https://github.com/caolan/async/issues/1028), [#1041](https://github.com/caolan/async/issues/1041))
- `{METHOD}` and `{METHOD}Series` are now implemented in terms of `{METHOD}Limit`. This is a major internal simplification, and is not expected to cause many problems, but it does subtly affect how functions execute internally. ([#778](https://github.com/caolan/async/issues/778), [#847](https://github.com/caolan/async/issues/847))
- `retry`'s callback is now optional. Previously, omitting the callback would partially apply the function, meaning it could be passed directly as a task to `series` or `auto`. The partially applied "control-flow" behavior has been separated out into `retryable`. ([#1054](https://github.com/caolan/async/issues/1054), [#1058](https://github.com/caolan/async/issues/1058))
- The test function for `whilst`, `until`, and `during` used to be passed non-error args from the iteratee function's callback, but this led to weirdness where the first call of the test function would be passed no args. We have made it so the test function is never passed extra arguments, and only the `doWhilst`, `doUntil`, and `doDuring` functions pass iteratee callback arguments to the test function ([#1217](https://github.com/caolan/async/issues/1217), [#1224](https://github.com/caolan/async/issues/1224))
- The `q.tasks` array has been renamed `q._tasks` and is now implemented as a doubly linked list (DLL). Any code that used to interact with this array will need to be updated to either use the provided helpers or support DLLs ([#1205](https://github.com/caolan/async/issues/1205)).
- The timing of the `q.saturated()` callback in a `queue` has been modified to better reflect when tasks pushed to the queue will start queueing. ([#724](https://github.com/caolan/async/issues/724), [#1078](https://github.com/caolan/async/issues/1078))
- Removed `iterator` method in favour of [ES2015 iterator protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators ) which natively supports arrays ([#1237](https://github.com/caolan/async/issues/1237))
- Dropped support for Component, Jam, SPM, and Volo ([#1175](https://github.com/caolan/async/issues/1175), #[#176](https://github.com/caolan/async/issues/176))

## Bug Fixes

- Improved handling of no dependency cases in `auto` & `autoInject` ([#1147](https://github.com/caolan/async/issues/1147)).
- Fixed a bug where the callback generated by `asyncify` with  `Promises` could resolve twice ([#1197](https://github.com/caolan/async/issues/1197)).
- Fixed several documented optional callbacks not actually being optional ([#1223](https://github.com/caolan/async/issues/1223)).

## Other

- Added `someSeries` and `everySeries` for symmetry, as well as a complete set of `any`/`anyLimit`/`anySeries` and `all`/`/allLmit`/`allSeries` aliases.
- Added `find` as an alias for `detect. (as well as `findLimit` and `findSeries`).
- Various doc fixes ([#1005](https://github.com/caolan/async/issues/1005), [#1008](https://github.com/caolan/async/issues/1008), [#1010](https://github.com/caolan/async/issues/1010), [#1015](https://github.com/caolan/async/issues/1015), [#1021](https://github.com/caolan/async/issues/1021), [#1037](https://github.com/caolan/async/issues/1037), [#1039](https://github.com/caolan/async/issues/1039), [#1051](https://github.com/caolan/async/issues/1051), [#1102](https://github.com/caolan/async/issues/1102), [#1107](https://github.com/caolan/async/issues/1107), [#1121](https://github.com/caolan/async/issues/1121), [#1123](https://github.com/caolan/async/issues/1123), [#1129](https://github.com/caolan/async/issues/1129), [#1135](https://github.com/caolan/async/issues/1135), [#1138](https://github.com/caolan/async/issues/1138), [#1141](https://github.com/caolan/async/issues/1141), [#1153](https://github.com/caolan/async/issues/1153), [#1216](https://github.com/caolan/async/issues/1216), [#1217](https://github.com/caolan/async/issues/1217), [#1232](https://github.com/caolan/async/issues/1232), [#1233](https://github.com/caolan/async/issues/1233), [#1236](https://github.com/caolan/async/issues/1236), [#1238](https://github.com/caolan/async/issues/1238))

Thank you [**@aearly**](github.com/aearly) and [**@megawac**](github.com/megawac) for taking the lead on version 2 of async.