## v9.0.0

This major release brings many important features including:
- [Split the output](https://medium.com/@ehmicky/execa-9-release-d0d5daaa097f#3a26) into lines, or [progressively iterate](https://medium.com/@ehmicky/execa-9-release-d0d5daaa097f#3a26) over them.
- [Transform or filter](https://medium.com/@ehmicky/execa-9-release-d0d5daaa097f#cbd6) the input/output using [simple functions](https://medium.com/@ehmicky/execa-9-release-d0d5daaa097f#399a).
- Print the output [to the terminal](https://medium.com/@ehmicky/execa-9-release-d0d5daaa097f#693f) while still retrieving it programmatically.
- Redirect the input/output [from/to a file](https://medium.com/@ehmicky/execa-9-release-d0d5daaa097f#693f).
- [Advanced piping](https://medium.com/@ehmicky/execa-9-release-d0d5daaa097f#ec17) between multiple subprocesses.
- Improved [verbose mode](https://medium.com/@ehmicky/execa-9-release-d0d5daaa097f#2913), for debugging.
- More [detailed errors](https://medium.com/@ehmicky/execa-9-release-d0d5daaa097f#40d7), including when [terminating subprocesses](https://medium.com/@ehmicky/execa-9-release-d0d5daaa097f#668c).
- Enhanced [template string syntax](https://medium.com/@ehmicky/execa-9-release-d0d5daaa097f#725b).
- [Global/shared options](https://medium.com/@ehmicky/execa-9-release-d0d5daaa097f#bcbf).
- [Web streams](https://medium.com/@ehmicky/execa-9-release-d0d5daaa097f#5731) and Transform streams support.
- [Convert the subprocess](https://medium.com/@ehmicky/execa-9-release-d0d5daaa097f#47b9) to a stream.
- [New documentation](readme.md#documentation) with many examples.

Please check the [release post](https://medium.com/@ehmicky/execa-9-release-d0d5daaa097f) for a high-level overview! For the full list of breaking changes, features and bug fixes, please read below.

Thanks @younggglcy, @koshic, @am0o0 and @codesmith-emmy for your help!

---

One of the maintainers @ehmicky is looking for a remote full-time position. Specialized in Node.js back-ends and CLIs, he led Netlify [Build](https://www.netlify.com/platform/core/build/), [Plugins](https://www.netlify.com/integrations/) and Configuration for 2.5 years. Feel free to contact him on [his website](https://www.mickael-hebert.com) or on [LinkedIn](https://www.linkedin.com/in/mickaelhebert/)!

---

## Breaking changes (not types)

- Dropped support for Node.js version `<18.19.0` and `20.0.0 - 20.4.0`. (834e3726)

- When the [`encoding` option](docs/api.md#optionsencoding) is `'buffer'`, the output ([`result.stdout`](docs/api.md#resultstdout), [`result.stderr`](docs/api.md#resultstderr), [`result.all`](docs/api.md#resultall)) is now an [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) instead of a [`Buffer`](https://nodejs.org/api/buffer.html#class-buffer). For more information, see [this blog post](https://sindresorhus.com/blog/goodbye-nodejs-buffer). (by @younggglcy) (#586)

```js
const {stdout} = await execa('node', ['file.js'], {encoding: 'buffer'});
console.log(stdout); // This is now an Uint8Array
```

- Renamed some of the allowed values for the [`encoding`](docs/api.md#optionsencoding) option. (#586, #928)

```diff
- await execa('node', ['file.js'], {encoding: null});
+ await execa('node', ['file.js'], {encoding: 'buffer'});

- await execa('node', ['file.js'], {encoding: 'utf-8'});
+ await execa('node', ['file.js'], {encoding: 'utf8'});

- await execa('node', ['file.js'], {encoding: 'UTF8'});
+ await execa('node', ['file.js'], {encoding: 'utf8'});

- await execa('node', ['file.js'], {encoding: 'utf-16le'});
+ await execa('node', ['file.js'], {encoding: 'utf16le'});

- await execa('node', ['file.js'], {encoding: 'ucs2'});
+ await execa('node', ['file.js'], {encoding: 'utf16le'});

- await execa('node', ['file.js'], {encoding: 'ucs-2'});
+ await execa('node', ['file.js'], {encoding: 'utf16le'});

- await execa('node', ['file.js'], {encoding: 'binary'});
+ await execa('node', ['file.js'], {encoding: 'latin1'});
```

- Passing a file path to `subprocess.pipeStdout()`, `subprocess.pipeStderr()` and `subprocess.pipeAll()` has been removed. Instead, a [`{file: './path'}` object](docs/output.md#file-output) should be passed to the [`stdout`](docs/api.md#optionsstdout) or [`stderr`](docs/api.md#optionsstderr) option. (#752)

```diff
- await execa('node', ['file.js']).pipeStdout('output.txt');
+ await execa('node', ['file.js'], {stdout: {file: 'output.txt'}});

- await execa('node', ['file.js']).pipeStderr('output.txt');
+ await execa('node', ['file.js'], {stderr: {file: 'output.txt'}});

- await execa('node', ['file.js']).pipeAll('output.txt');
+ await execa('node', ['file.js'], {
+	stdout: {file: 'output.txt'},
+	stderr: {file: 'output.txt'},
+});
```

- Passing a [writable stream](https://nodejs.org/api/stream.html#class-streamwritable) to `subprocess.pipeStdout()`, `subprocess.pipeStderr()` and `subprocess.pipeAll()` has been removed. Instead, the stream should be passed to the [`stdout`](docs/api.md#optionsstdout) or [`stderr`](docs/api.md#optionsstderr) option. If the stream [does not have a file descriptor](docs/streams.md#file-descriptors), [`['pipe', stream]`](docs/output.md#multiple-targets) should be passed instead. (#752)

```diff
- await execa('node', ['file.js']).pipeStdout(stream);
+ await execa('node', ['file.js'], {stdout: ['pipe', stream]});

- await execa('node', ['file.js']).pipeStderr(stream);
+ await execa('node', ['file.js'], {stderr: ['pipe', stream]});

- await execa('node', ['file.js']).pipeAll(stream);
+ await execa('node', ['file.js'], {
+	stdout: ['pipe', stream],
+	stderr: ['pipe', stream],
+});
```

- The `subprocess.pipeStdout()`, `subprocess.pipeStderr()` and `subprocess.pipeAll()` methods have been renamed to [`subprocess.pipe()`](docs/api.md#subprocesspipefile-arguments-options). The command and its arguments can be passed to `subprocess.pipe()` directly, without calling `execa()` a second time. The [`from`](docs/api.md#pipeoptionsfrom) piping option can specify `'stdout'` (the default value), `'stderr'` or `'all'`. (#757)

```diff
- await execa('node', ['file.js']).pipeStdout(execa('node', ['other.js']));
+ await execa('node', ['file.js']).pipe('node', ['other.js']);

- await execa('node', ['file.js']).pipeStderr(execa('node', ['other.js']));
+ await execa('node', ['file.js']).pipe('node', ['other.js'], {from: 'stderr'});

- await execa('node', ['file.js']).pipeAll(execa('node', ['other.js']));
+ await execa('node', ['file.js']).pipe('node', ['other.js'], {from: 'all'});
```

- Renamed the `signal` option to [`cancelSignal`](docs/api.md#optionscancelsignal). (#880)

```diff
- await execa('node', ['file.js'], {signal: abortController.signal});
+ await execa('node', ['file.js'], {cancelSignal: abortController.signal});
```

- Renamed `error.killed` to [`error.isTerminated`](docs/api.md#erroristerminated). (#625)

```diff
try {
	await execa('node', ['file.js']);
} catch (error) {
- if (error.killed) {
+ if (error.isTerminated) {
		// ...
	}
}
```

- `subprocess.cancel()` has been removed. Please use either [`subprocess.kill()`](docs/api.md#subprocesskillsignal-error) or the [`cancelSignal`](docs/api.md#optionscancelsignal) option instead. (#711)

```diff
- subprocess.cancel();
+ subprocess.kill();
```

- Renamed the `forceKillAfterTimeout` option to [`forceKillAfterDelay`](docs/api.md#optionsforcekillafterdelay). Also, it is now passed to [`execa()`](docs/api.md#execafile-arguments-options) instead of [`subprocess.kill()`](docs/api.md#subprocesskillsignal-error). (#714, #723)

```diff
- const subprocess = execa('node', ['file.js']);
- subprocess.kill('SIGTERM', {forceKillAfterTimeout: 1000});
+ const subprocess = execa('node', ['file.js'], {forceKillAfterDelay: 1000});
+ subprocess.kill('SIGTERM');
```

- The [`verbose`](docs/api.md#optionsverbose) option is now a string enum instead of a boolean. `false` has been renamed to `'none'` and `true` has been renamed to [`'short'`](docs/debugging.md#short-mode). (#884)

```diff
- await execa('node', ['file.js'], {verbose: false});
+ await execa('node', ['file.js'], {verbose: 'none'});

- await execa('node', ['file.js'], {verbose: true});
+ await execa('node', ['file.js'], {verbose: 'short'});
```

- The `execPath` option has been renamed to [`nodePath`](docs/api.md#optionsnodepath). It is now a noop unless the [`node`](docs/api.md#optionsnode) option is `true`. Also, it now works even if the [`preferLocal`](docs/api.md#optionspreferlocal) option is `false`. (#812, #815)

```diff
- await execa('node', ['file.js'], {execPath: './path/to/node'});
+ await execa('node', ['file.js'], {nodePath: './path/to/node'});
```

- The [default value](docs/ipc.md#message-type) for the [`serialization`](docs/api.md#optionsserialization) option is now [`'advanced'`](https://nodejs.org/api/child_process.html#advanced-serialization) instead of `'json'`. In particular, when calling [`subprocess.send(object)`](docs/api.md#subprocesssendmessage) with an object that contains functions or symbols, those were previously silently removed. Now this will throw an exception. (#905)

```diff
- subprocess.send({example: true, getExample() {}});
+ subprocess.send({example: true});
```

- If [`subprocess.stdout`](docs/api.md#subprocessstdout), [`subprocess.stderr`](docs/api.md#subprocessstderr) or [`subprocess.all`](docs/api.md#subprocessall) is manually piped, the [`.pipe()`](https://nodejs.org/api/stream.html#readablepipedestination-options) call must now happen as soon as `subprocess` is created. Otherwise, the output at the beginning of the subprocess might be missing. (#658, #747)

```diff
const subprocess = execa('node', ['file.js']);
- setTimeout(() => {
	subprocess.stdout.pipe(process.stdout);
- }, 0);
```

- Signals passed to [`subprocess.kill()`](docs/api.md#subprocesskillsignal-error) and to the [`killSignal`](docs/api.md#optionskillsignal) option cannot be lowercase anymore. (#1025)

```diff
- const subprocess = execa('node', ['file.js'], {killSignal: 'sigterm'});
+ const subprocess = execa('node', ['file.js'], {killSignal: 'SIGTERM'});

- subprocess.kill('sigterm');
+ subprocess.kill('SIGTERM');
```

## Features

### Execution

- Use the [template string syntax](docs/execution.md#template-string-syntax) with any method (including [`execa()`](docs/api.md#execacommand)), as opposed to only [`$`](docs/api.md#file-arguments-options). Conversely, `$` can now use the [regular array syntax](docs/scripts.md#template-string-syntax). (#933)
- A command's template string can span [multiple lines](docs/execution.md#multiple-lines). (#843)
- [Share options](docs/execution.md#globalshared-options) between multiple calls, or set global options, by using [`execa(options)`](docs/api#execaoptions). (#933, #965)
- Pass a file URL (as opposed to a file path string) to [`execa()`](docs/api.md#execafile-arguments-options), [`execaNode()`](docs/api.md#execanodescriptpath-arguments-options), the [`inputFile`](docs/api.md#optionsinputfile) option, the [`nodePath`](docs/api.md#optionsnodepath) option or the [`shell`](docs/api.md#optionsshell) option. (#630, #631, #632, #635)

### Text lines

- [Split the output](docs/lines.md#simple-splitting) into text lines by using the [`lines`](docs/api.md#optionslines) option. (#741, #929, #931, #948, #951, #957)
- Subprocess is now an [async iterable](docs/api.md#subprocesssymbolasynciterator), [iterating over the output](docs/lines.md#progressive-splitting) lines while the subprocess is running. (#923)

### Piping multiple subprocesses

- Simpler syntax: pass the [command directly](docs/pipe.md#array-syntax) to [`subprocess.pipe()`](docs/api.md#subprocesspipefile-arguments-options) without calling [`execa()`](docs/api.md#execafile-arguments-options). A [template string](docs/pipe.md#template-string-syntax) can also be used. (#840, #859, #864)
- [Wait for both subprocesses](docs/pipe.md#result) to complete. [Error handling](docs/pipe.md#errors) has been improved too. (#757, #778, #834, #854)
- Retrieve the [result](docs/pipe.md#result) of each subprocess (not only the last one) by using [`result.pipedFrom`](docs/api.md#resultpipedfrom) and [`error.pipedFrom`](docs/api.md#resultpipedfrom). (#834)
- Pipe 1 or [many subprocesses](docs/pipe.md#multiple-sources-1-destination) to 1 or [many subprocesses](docs/pipe.md#1-source-multiple-destinations). (#834)
- Pipe subprocesses using [other file descriptors](docs/pipe.md#source-file-descriptor) than `stdin`/`stdout`/`stderr` by using the [`from`](docs/api.md#pipeoptionsfrom) and [`to`](docs/api.md#pipeoptionsto) piping options. (#757, #834, #903, #920)
- [Cancel piping](docs/pipe.md#unpipe) subprocesses by using the [`unpipeSignal`](docs/api.md#pipeoptionsunpipesignal) piping option. (#834, #852)

### Input/output

- Pass an array with [multiple values](docs/output.md#multiple-targets) to the [`stdin`](docs/api.md#optionsstdin), [`stdout`](docs/api.md#optionsstdout) and [`stderr`](docs/api.md#optionsstderr) options. For example, [`stdout: ['inherit', 'pipe']`](docs/output.md#multiple-targets) prints the output [to the terminal](docs/output.md#terminal-output) while still [returning it](docs/output.md#stdout-and-stderr) as [`result.stdout`](docs/api.md#resultstdout). (#643, #765, #941, #954)
- Redirect the [input](docs/input.md#file-input)/[output](docs/output.md#file-output) from/to a file by passing a `{file: './path'}` object or a file URL to the [`stdin`](docs/api.md#optionsstdin), [`stdout`](docs/api.md#optionsstdout) or [`stderr`](docs/api.md#optionsstderr) option. (#610, #614, #621, #671, #1004)
- [Transform](docs/transform.md) or [filter](docs/transform.md#filtering) the input/output by passing a generator function to the [`stdin`](docs/api.md#optionsstdin), [`stdout`](docs/api.md#optionsstdout) or [`stderr`](docs/api.md#optionsstderr) option. (#693, #697, #698, #699, #709, #736, #737, #739, #740, #746, #748, #755, #756, #780, #783, #867, #915, #916, #917, #919, #924, #926, #945, #969)
- Provide some [binary input](docs/binary.md#binary-input) by passing an [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) to the [`input`](docs/api.md#optionsinput) or [`stdin`](docs/api.md#optionsstdin) option. (834e3726, #670, #1029)
- Provide some [progressive input](docs/streams.md#iterables-as-input) by passing a sync/async [iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols) to the [`stdin`](docs/api.md#optionsstdin) option. (#604, #944)
- Provide [multiple inputs](docs/output.md#multiple-targets) by combining the [`stdin`](docs/api.md#optionsstdin), [`input`](docs/api.md#optionsinput) and [`inputFile`](docs/api.md#optionsinputfile) options. (#666)
- Return [other file descriptors](docs/output.md#additional-file-descriptors) than [`result.stdout`](docs/api.md#resultstdout) and [`result.stderr`](docs/api.md#resultstderr) by using [`result.stdio`](docs/api.md#resultstdio). (#676)
- [Specify different values](docs/output.md#stdoutstderr-specific-options) for [`stdout`](docs/api.md#optionsstdout) and [`stderr`](docs/api.md#optionsstderr) with the following options: [`verbose`](docs/api.md#optionsverbose), [`lines`](docs/api.md#optionslines), [`stripFinalNewline`](docs/api.md#optionsstripfinalnewline), [`maxBuffer`](docs/api.md#optionsmaxbuffer), [`buffer`](docs/api.md#optionsbuffer). (#966, #970, #971, #972, #973, #974)

### Streams

- Redirect the input/output from/to a [web stream](docs/streams.md#web-streams) by passing a [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) or [`WritableStream`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream) to the [`stdin`](docs/api.md#optionsstdin), [`stdout`](docs/api.md#optionsstdout) or [`stderr`](docs/api.md#optionsstderr) option. (#615, #619, #645)
- [Transform or filter](docs/transform.md#duplextransform-streams) the input/output by passing a [`Duplex`](https://nodejs.org/api/stream.html#class-streamduplex), Node.js [`Transform`](https://nodejs.org/api/stream.html#class-streamtransform) or web [`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream) to the [`stdin`](docs/api.md#optionsstdin), [`stdout`](docs/api.md#optionsstdout) or [`stderr`](docs/api.md#optionsstderr) option. (#937, #938)
- [Convert the subprocess](docs/streams.md#converting-a-subprocess-to-a-stream) to a stream by using [`subprocess.readable()`](docs/api.md#subprocessreadablereadableoptions), [`subprocess.writable()`](docs/api.md#subprocesswritablewritableoptions) or [`subprocess.duplex()`](docs/api.md#subprocessduplexduplexoptions). (#912, #922, #958)

### Verbose mode

- Print the subprocess' [completion, duration and errors](docs/debugging.md#short-mode) with the [`verbose: 'short'`](docs/api.md#optionsverbose) or `verbose: 'full'` option. (#887, #890)
- Print the subprocess' [output](docs/debugging.md#full-mode) with the [`verbose: 'full'`](docs/api.md#optionsverbose) option. (#884, #950, #962, #990)
- Prettier formatting and [colors](docs/debugging.md#colors) with the [`verbose`](docs/api.md#optionsverbose) option. (#883, #893, #894)

### Debugging

- Retrieve the subprocess' [duration](docs/debugging.md#duration) by using [`result.durationMs`](docs/api.md#resultdurationms) and [`error.durationMs`](docs/api.md#resultdurationms). (#896)
- Retrieve the subprocess' [current directory](docs/environment.md#current-directory) by using [`result.cwd`](docs/api.md#resultcwd). Previously only [`error.cwd`](docs/api.md#execaerror) was available. Also, `result.cwd` and `error.cwd` are now normalized to absolute file paths. (#803)
- Printing [`result.escapedCommand`](docs/api.md#resultescapedcommand) in a terminal [is now safe](docs/debugging.md#command). (#875)

### Errors

- The [`ExecaError`](docs/api.md#execaerror) and [`ExecaSyncError`](docs/api.md#execasyncerror) classes [are now exported](docs/errors.md#subprocess-failure). (#911)
- Find the subprocess failure's [root cause](docs/termination.md#error-message-and-stack-trace) by using [`error.cause`](docs/api.md#errorcause). (#911)
- Know whether [the subprocess failed](docs/errors.md#failure-reason) due to the [`maxBuffer`](docs/api.md#optionsmaxbuffer) option by using [`error.isMaxBuffer`](docs/api.md#errorismaxbuffer). (#963)
- Improved [`error.message`](docs/api.md#errormessage): [`error.stdout`](docs/api.md#resultstdout) and [`error.stderr`](docs/api.md#resultstderr) are now [interleaved](docs/output.md#interleaved-output) if the [`all`](docs/api.md#optionsall) option is `true`. [Additional file descriptors](docs/output.md#additional-file-descriptors) are now printed too. Also, the [formatting](docs/errors.md#error-message) has been improved. (#676, #705, #991, #992)
- [Control characters](https://en.wikipedia.org/wiki/Control_character) in [`error.message`](docs/api.md#errormessage) are now escaped, so they don't result in visual bugs when printed in a terminal. (#879)
- Improved stack trace when an [`error`](https://nodejs.org/api/stream.html#event-error_1) event is emitted on [`subprocess.stdout`](docs/api.md#subprocessstdout) or [`subprocess.stderr`](docs/api.md#subprocessstderr). (#814)

### Termination

- Specify an [error message or stack trace](docs/termination.md#error-message-and-stack-trace) when terminating a subprocess by passing an error instance to [`subprocess.kill()`](docs/api.md#subprocesskillerror). (#811, #836, #1023)
- The [`forceKillAfterDelay`](docs/api.md#optionsforcekillafterdelay) and [`killSignal`](docs/api.md#optionskillsignal) options [now apply to terminations](docs/termination.md#default-signal) due not only to [`subprocess.kill()`](docs/api.md#subprocesskillsignal-error) but [also to](docs/termination.md#forceful-termination) the [`cancelSignal`](docs/api.md#optionscancelsignal), [`timeout`](docs/api.md#optionstimeout), [`maxBuffer`](docs/api.md#optionsmaxbuffer) and [`cleanup`](docs/api.md#optionscleanup) options. (#714, #728)

### Node.js files

- Use the [`nodePath`](docs/api.md#optionsnodepath) and [`nodeOptions`](docs/api.md#optionsnodeoptions) options with [any method](docs/api.md#methods), as opposed to only [`execaNode()`](docs/api.md#execanodescriptpath-arguments-options), by passing the [`node: true`](docs/api.md#optionsnode) option. (#804, #812, #815)
- When using [`execaNode()`](docs/api.md#execanodescriptpath-arguments-options) or the [`node: true`](docs/api.md#optionsnode) option, the [current Node.js version](docs/node.md#nodejs-version) is now inherited deeply. If the subprocess spawns other subprocesses, they will all use the [same Node.js version](docs/api.md#optionsnodepath). (#812, #815, #1011)

### Synchronous execution

- Use the [`all`](docs/api.md#optionsall) and [`buffer: false`](docs/api.md#optionsbuffer) options with [`execaSync()`](docs/api.md#execasyncfile-arguments-options), as opposed to only [`execa()`](docs/api.md#execafile-arguments-options). (#953, #956)
- Added the [`$.s`](docs/api.md#file-arguments-options) alias for [`$.sync`](docs/api.md#file-arguments-options). (#594)

### Inter-process communication

- Use the [`ipc: true`](docs/api.md#optionsipc) option, as [opposed to the more verbose](docs/ipc.md#exchanging-messages) [`stdio: ['pipe', 'pipe', 'pipe', 'ipc']`](docs/api.md#optionsstdio) option. (#794)

### Input validation

- Improved the validation of the [`input`](docs/api.md#optionsinput), [`timeout`](docs/api.md#optionstimeout), [`cwd`](docs/api.md#optionscwd), [`detached`](docs/api.md#optionsdetached), [`cancelSignal`](docs/api.md#optionscancelsignal) and [`encoding`](docs/api.md#optionsencoding) options. (#668, #715, #803, #928, #940)
- Improved the validation of the arguments passed to [`execa()`](docs/api.md#execafile-arguments-options) and the [other exported methods](docs/api.md#methods). (#838, #873, #899)
- Improved the validation of signals passed to [`subprocess.kill()`](docs/api.md#subprocesskillsignal-error) and to the [`killSignal`](docs/api.md#optionskillsignal) option. (#1025)

## Bug fixes

- Fixed passing `undefined` values as [options](docs/api.md#options). This now uses the option's default value. (#712)
- Fixed the process crashing when the [`inputFile`](docs/api.md#optionsinputfile) option points to a missing file. (#609)
- Fixed the process crashing when the [`buffer`](docs/api.md#optionsbuffer) option is `false` and [`subprocess.stdout`](docs/api.md#subprocessstdout) [errors](https://nodejs.org/api/stream.html#event-error_1). (#729)
- Fixed the process crashing when passing [`'overlapped'`](docs/windows.md#asynchronous-io) to the [`stdout`](docs/api.md#optionsstdout) or [`stderr`](docs/api.md#optionsstderr) option with [`execaSync()`](docs/api.md#execasyncfile-arguments-options). (#949)
- Fixed the process crashing when multiple [`'error'`](https://nodejs.org/api/child_process.html#event-error) events are emitted on the subprocess. (#790)
- Fixed the [`reject: false`](docs/api.md#optionsreject) option not being used when the subprocess [fails to spawn](docs/errors.md#failure-reason). (#734)
- Fixed [some inaccuracies](docs/errors.md#failure-reason) with [`error.isTerminated`](docs/api.md#erroristerminated). (#625, #719)
	- It is now `true` when the subprocess fails due to the [`timeout`](docs/api.md#optionstimeout) option.
	- It is now `true` when calling [`process.kill(subprocess.pid)`](https://nodejs.org/api/process.html#processkillpid-signal), except on Windows.
	- It is now `false` when using [non-terminating signals](https://nodejs.org/api/child_process.html#subprocesskillsignal) such as `subprocess.kill(0)`.
- Fixed missing [`error.signal`](docs/api.md#errorsignal) and [`error.signalDescription`](docs/api.md#errorsignaldescription) when the subprocess [is terminated](docs/termination.md#canceling) by the [`cancelSignal`](docs/api.md#optionscancelsignal) option. (#724)
- Fixed a situation where the [error](docs/api.md#execaerror) returned by an [`execa()`](docs/api.md#execafile-arguments-options) call might be modified by another `execa()` call. (#796, #806, #911)
- Fixed the [`verbose`](docs/api.md#optionsverbose) option [printing the command](docs/debugging.md#short-mode) in the wrong order. (#600)
- Fixed using both the [`maxBuffer`](docs/api.md#optionsmaxbuffer) and [`encoding`](docs/api.md#optionsencoding) options. For example, when using [`encoding: 'hex'`](docs/binary.md#encoding), `maxBuffer` will now be measured in hexadecimal characters. Also, [`error.stdout`](docs/api.md#resultstdout), [`error.stderr`](docs/api.md#resultstderr) and [`error.all`](docs/api.md#resultall) were previously not applying the `maxBuffer` option. (#652, #696)
- Fixed the [`maxBuffer`](docs/api.md#optionsmaxbuffer) option [not truncating](docs/output.md#big-output) [`result.stdout`](docs/api.md#resultstdout) and [`result.stderr`](docs/api.md#resultstderr) when using [`execaSync()`](docs/api.md#execasyncfile-arguments-options). (#960)
- Fixed empty output when using the [`buffer: true`](docs/api.md#optionsbuffer) option (its default value) and [iterating](https://nodejs.org/api/stream.html#readablesymbolasynciterator) over [`subprocess.stdout`](docs/api.md#subprocessstdout) or [`subprocess.stderr`](docs/api.md#subprocessstderr). (#908)
- Fixed [`subprocess.all`](docs/api.md#subprocessall) stream incorrectly being in [object mode](https://nodejs.org/api/stream.html#object-mode). (#717)
- Ensured [`subprocess.stdout`](docs/api.md#subprocessstdout) and [`subprocess.stderr`](docs/api.md#subprocessstderr) are properly [flushed](https://nodejs.org/api/stream.html#buffering) when the subprocess fails. (#647)
- Fixed a race condition leading to random behavior with the [`timeout`](docs/api.md#optionstimeout) option. (#727)

## Breaking changes (types)

- The minimum supported TypeScript version is now [`5.1.6`](https://github.com/microsoft/TypeScript/releases/tag/v5.1.6).

- Renamed `CommonOptions` type to [`Options`](types/arguments/options.d.ts) (for [`execa()`](docs/api.md#execafile-arguments-options)) and [`SyncOptions`](types/arguments/options.d.ts) (for [`execaSync()`](docs/api.md#execasyncfile-arguments-options)). (#678, #682)

```diff
import type {Options} from 'execa';

- const options: CommonOptions = {timeout: 1000};
+ const options: Options = {timeout: 1000};
```

- Renamed `NodeOptions` type to [`Options`](types/arguments/options.d.ts). (#804)

```diff
import type {Options} from 'execa';

- const options: NodeOptions = {nodeOptions: ['--no-warnings']};
+ const options: Options = {nodeOptions: ['--no-warnings']};
```

- Renamed `KillOptions` type to [`Options`](types/arguments/options.d.ts). (#714)

```diff
import type {Options} from 'execa';

- const options: KillOptions = {forceKillAfterTimeout: 1000};
+ const options: Options = {forceKillAfterDelay: 1000};
```

- Removed generic parameters from the [`Options`](types/arguments/options.d.ts) and [`SyncOptions`](types/arguments/options.d.ts) types. (#681)

```diff
import type {Options} from 'execa';

- const options: Options<'utf8'> = {encoding: 'utf8'};
+ const options: Options = {encoding: 'utf8'};
```

- Renamed `ExecaChildProcess` type to [`ResultPromise`](types/subprocess/subprocess.d.ts). This is the type of [`execa()`](docs/api.md#execafile-arguments-options)'s [return value](docs/api.md#return-value), which is both a [`Promise<Result>`](docs/api.md#result) and a [`Subprocess`](docs/api.md#subprocess). (#897, #1007, #1009)

```diff
import type {ResultPromise, Result} from 'execa';

- const promiseOrSubprocess: ExecaChildProcess = execa('node', ['file.js']);
+ const promiseOrSubprocess: ResultPromise = execa('node', ['file.js']);
const result: Result = await promiseOrSubprocess;
promiseOrSubprocess.kill();
```

- Renamed `ExecaChildPromise` type to [`Subprocess`](types/subprocess/subprocess.d.ts). This is the type of the [subprocess instance](docs/api.md#subprocess). (#897, #1007, #1009)

```diff
import type {Subprocess} from 'execa';

- const subprocess: ExecaChildPromise = execa('node', ['file.js']);
+ const subprocess: Subprocess = execa('node', ['file.js']);
subprocess.kill();
```

- Renamed `ExecaReturnBase`, `ExecaReturnValue` and `ExecaSyncReturnValue` type to [`Result`](types/return/result.d.ts) (for [`execa()`](docs/api.md#execafile-arguments-options)) and [`SyncResult`](types/return/result.d.ts) (for [`execaSync()`](docs/api.md#execasyncfile-arguments-options)). (#897, #1009)

```diff
import type {Result, SyncResult} from 'execa';

- const result: ExecaReturnBase = await execa('node', ['file.js']);
+ const result: Result = await execa('node', ['file.js']);

- const result: ExecaReturnValue = await execa('node', ['file.js']);
+ const result: Result = await execa('node', ['file.js']);

- const result: ExecaSyncReturnValue = execaSync('node', ['file.js']);
+ const result: SyncResult = execaSync('node', ['file.js']);
```

- Renamed the type of the [`stdin`](docs/api.md#optionsstdin) option from `StdioOption` to [`StdinOption`](types/stdio/type.d.ts) (for [`execa()`](docs/api.md#execafile-arguments-options)) and [`StdinSyncOption`](types/stdio/type.d.ts) (for [`execaSync()`](docs/api.md#execasyncfile-arguments-options)). (#942, #1008, #1012)

```diff
import {execa, type StdinOption} from 'execa';

- const stdin: StdioOption = 'inherit';
+ const stdin: StdinOption = 'inherit';
await execa('node', ['file.js'], {stdin});
```

- Renamed the type of the [`stdout`](docs/api.md#optionsstdout) and [`stderr`](docs/api.md#optionsstderr) options from `StdioOption` to [`StdoutStderrOption`](types/stdio/type.d.ts) (for [`execa()`](docs/api.md#execafile-arguments-options)) and [`StdoutStderrSyncOption`](types/stdio/type.d.ts) (for [`execaSync()`](docs/api.md#execasyncfile-arguments-options)). (#942, #1008, #1012)

```diff
import {execa, type StdoutStderrOption} from 'execa';

- const stdout: StdioOption = 'inherit';
+ const stdout: StdoutStderrOption = 'inherit';
- const stderr: StdioOption = 'inherit';
+ const stderr: StdoutStderrOption = 'inherit';
await execa('node', ['file.js'], {stdout, stderr});
```

- Renamed the type of the [`stdio`](docs/api.md#optionsstdio) option from `StdioOption[]` to [`Options['stdio']`](types/arguments/options.d.ts) (for [`execa()`](docs/api.md#execafile-arguments-options)) and [`SyncOptions['stdio']`](types/arguments/options.d.ts) (for [`execaSync()`](docs/api.md#execasyncfile-arguments-options)). (#942, #1008)

```diff
import {execa, type Options} from 'execa';

- const stdio: readonly StdioOption[] = ['inherit', 'pipe', 'pipe'] as const;
+ const stdio: Options['stdio'] = ['inherit', 'pipe', 'pipe'] as const;
await execa('node', ['file.js'], {stdio});
```

- The optional generic parameter passed to the [`Result`](types/return/result.d.ts), [`SyncResult`](types/return/result.d.ts), [`ExecaError`](types/return/final-error.d.ts), [`ExecaSyncError`](types/return/final-error.d.ts), [`ResultPromise`](types/subprocess/subprocess.d.ts) and [`Subprocess`](types/subprocess/subprocess.d.ts) types is now an [`Options`](types/arguments/options.d.ts) type. (#681)

```diff
import type {Result} from 'execa';

- const result: ExecaReturnValue<Buffer> = await execa('node', ['file.js'], {encoding: 'buffer'});
+ const result: Result<{encoding: 'buffer'}> = await execa('node', ['file.js'], {encoding: 'buffer'});
// Or even better, since it is inferred:
+ const result: Result = await execa('node', ['file.js'], {encoding: 'buffer'});
```

## Improvements (types)

- Stricter types for the [`stdin`](docs/api.md#optionsstdin), [`stdout`](docs/api.md#optionsstdout), [`stderr`](docs/api.md#optionsstderr) and [`stdio`](docs/api.md#optionsstdio) options. (#634, #943, #952)
- Stricter types for [`result.stdout`](docs/api.md#resultstdout), [`result.stderr`](docs/api.md#resultstderr), [`result.all`](docs/api.md#resultall), [`subprocess.stdout`](docs/api.md#subprocessstdout), [`subprocess.stderr`](docs/api.md#subprocessstderr) and [`subprocess.all`](docs/api.md#subprocessall). (#681, #684, #687, #689, #833)
- Stricter types for the [synchronous methods](docs/execution.md#synchronous-execution) like [`execaSync()`](docs/api.md#execasyncfile-arguments-options). (#678, #939)
- Stricter types for the [`reject`](docs/api.md#optionsreject) option. (#688)
- Stricter types for [`error.signal`](docs/api.md#errorsignal) and the [`killSignal`](docs/api.md#optionskillsignal) option. (#1025)
- Fixed the type of [`error.exitCode`](docs/api.md#errorexitcode), since that field is sometimes `undefined`. (#680)
- Refactored and improved the types. (by @koshic) (#583)

## Documentation

- Added [user guides](readme.md#documentation) to let you explore each feature with many examples. (#989, #996, #1015, #1022, #1026)
- Improved the [documentation](readme.md#documentation) and fixed inaccuracies. (#626, #637, #640, #641, #644, #669, #680, #710, #759, #800, #801, #802, #860, #870, #876, #888, #907, #921, #935, #967, #968, #994, #998, #999, #1000, #1003, #1005, #1006, #1010)
- Fixed the examples for the [Script interface](docs/bash.md). (by @am0o0) (#575)
- Corrected some English grammar mistakes. (by @codesmith-emmy) (#731)
