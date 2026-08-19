v6.0.0
@okuryu okuryu released this Jun 21, 2021
· 37 commits to main since this release
 v6.0.0 
 3302c44 
Changelog

Add support for URL's (#123)
Bump mocha from 9.0.0 to 9.0.1 (#124)
Bump mocha from 8.4.0 to 9.0.0 (#121)
Update Node.js CI matrix (#122)
Bump mocha from 8.3.2 to 8.4.0 (#120)
Bump lodash from 4.17.19 to 4.17.21 (#119)
Bump y18n from 4.0.0 to 4.0.1 (#116)
Bump chai from 4.3.3 to 4.3.4 (#115)
Bump mocha from 8.3.1 to 8.3.2 (#114)
Bump mocha from 8.3.0 to 8.3.1 (#113)
Bump chai from 4.3.1 to 4.3.3 (#112)
Bump chai from 4.2.0 to 4.3.1 (#111)
Bump mocha from 8.2.1 to 8.3.0 (#109)
Bump mocha from 8.1.3 to 8.2.1 (#105)
Drop Travis CI settings (#100)
Change default branch name to main (#99)
GitHub Aactions (#98)
Behavior changes for URL objects

It serializes URL objects as follows since this version. The result of serialization may be changed if you are passing URL object values into the serialize-javascript.

const serialize = require("serialize-javascript");

serialize({u: new URL("http://example.com/")}); // '{"u":new URL("http://example.com/")}'
