v4.0.0:
in short:
- **migration from gaze to [chokidar](https://github.com/paulmillr/chokidar)** - this will improve stability and responsiveness of gulp-watch
- events on directory creation is now filtered out
- by default all files (that matched globs) will be emitted on first run with `add` event
- `close()` is now not necessary (if you don't use `persistent` option)
- event names changed (`added` -> `add`, `modified` -> `change` and `deleted` -> `unlink`)
- all logging now hidden in `verbose` option
- lots of issues should be fixed
