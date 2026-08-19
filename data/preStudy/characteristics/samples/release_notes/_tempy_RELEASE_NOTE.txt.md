v3.0.0
### Breaking

- Require Node.js 14 (#41)  4b3e859
- Changed from a default export to named exports:
	- `tempy.file` → `import {temporaryFile} from 'tempy'`
	- `tempy.file.task` → `import {temporaryFileTask} from 'tempy'`
	- `tempy.directory` → `import {temporaryDirectory} from 'tempy'`
	- `tempy.directory.task` → `import {temporaryDirectoryTask} from 'tempy'`
	- `tempy.write` → `import {temporaryWrite} from 'tempy'`
	- `tempy.write.task` → `import {temporaryWriteTask} from 'tempy'`
	- `tempy.writeSync` → `import {temporaryWriteSync} from 'tempy'`
	- `tempy.root` → `import {rootTemporaryDirectory} from 'tempy'`

https://github.com/sindresorhus/tempy/compare/v2.0.0...v3.0.0