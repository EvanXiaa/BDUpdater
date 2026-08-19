v17.0.0

Upgrade events to v3.x. EventEmitter instances now have an off() method. require('events').once can be used to react to an event being emitted with async/await syntax. (#1839)
Upgrade path-browserify to v1.x. (#1838)
Upgrade stream-browserify to v3.x. require('stream') now matches the Node.js 10+ API. (#1970)
Upgrade util to v0.12. Most notably, util.promisify and util.callbackify are finally available by default in browserify. (#1844)
Add JSON syntax checking. Syntax errors in .json files will now fail to bundle. (#1700)