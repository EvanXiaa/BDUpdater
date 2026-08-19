v6.0.0
This is a non-functional release intended to refresh the codebase and dependency tree. There are no changes to the library's API or behaviour.

## Breaking changes since 5.2.1

* Dropped support for Node versions less than v12.20

## Misc other improvements

* The package is now a native ES6 module while still maintaining support for CommonJS
* All dependencies updated to their latest version

##  Upgrade Notes

* If you're using Node v12.20 or above it's safe to upgrade with zero changes to your code. 
* Users of older versions of Node should stick with command-line-args v5.2.1.