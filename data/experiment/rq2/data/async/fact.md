applyEach/applyEachSeries have a simpler interface, to make them more easily type-able. It always returns a function that takes in a single callback argument. If that callback is omitted, a promise is returned, making it awaitable. (#1228, #1640)

In queue, priorityQueue, cargo and cargoQueue, the "event"-style methods, like q.drain and q.saturated are now methods that register a callback, rather than properties you assign a callback to. They are now of the form q.drain(callback). If you do not pass a callback a Promise will be returned for the next occurrence of the event, making them await-able, e.g. await q.drain().

during and doDuring have been removed, and instead whilst, doWhilst, until and doUntil now have asynchronous test functions. (#850, #1557)