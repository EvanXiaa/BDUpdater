1.0.0 New breaking changes

    onAny now takes the event that's being emitted as the first argument.

    Exports now contain the EventEmitter2 constructor. Should fix issues with requires.

    removeListener and removeListenerAny events to compliment newListener and newListenerAny

    new emitAsync event. Emits event and processes results of all listeners with Promise.all

    Bug fixes