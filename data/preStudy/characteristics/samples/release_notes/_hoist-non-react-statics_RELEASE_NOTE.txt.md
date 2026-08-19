v2.0.0
There should be no breaking changes for most users. Previous specs for static class properties used non-enumerable properties. To accommodate this we also hoisted non-enumerable properties. The spec has changed and class properties are now enumerable, so we have removed the hoisting of non-enumerables since it can be problematic with native properties.

Potentially Breaking Change
* Only hoist enumerable statics

New Features
* Hoist statics of inherited classes