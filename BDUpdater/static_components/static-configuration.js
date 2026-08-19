"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticConfiguration = void 0;
var path_1 = require("path");
var ts_node_1 = require("ts-node");
var StaticConfiguration = /** @class */ (function () {
    function StaticConfiguration() {
    }
    /**
     * returns true if running the mocha tests
     */
    StaticConfiguration.isRunningTests = function () {
        // Checks if ts-node is enabled (only the case for tests)
        return typeof process[ts_node_1.REGISTER_INSTANCE] === 'object';
    };
    // If running with ts-node, then the 'virtual' compiled file is next to the source file (not in the dist1 folder)
    StaticConfiguration.projectHome = StaticConfiguration.isRunningTests() ? (0, path_1.normalize)((0, path_1.resolve)(__dirname, '../')) : (0, path_1.normalize)((0, path_1.resolve)(__dirname, '../'));
    StaticConfiguration.outPath = (0, path_1.resolve)(StaticConfiguration.projectHome, 'out');
    StaticConfiguration.resPath = (0, path_1.resolve)(StaticConfiguration.projectHome, 'res');
    StaticConfiguration.gitPath = (0, path_1.resolve)(StaticConfiguration.outPath, 'git');
    StaticConfiguration.dockerFolder = (0, path_1.resolve)(StaticConfiguration.resPath, 'docker');
    StaticConfiguration.ignoreAccessPathsForOrdinaryCalls = false;
    StaticConfiguration.failAccessPathsUsingThirdPartyModules = true;
    StaticConfiguration.assumeUnknownReceiverMatches = true;
    StaticConfiguration.assumeFirstReceiverMatchOnUnknownLibraryObject = true;
    StaticConfiguration.checkForDeprecations = false;
    StaticConfiguration.useFilesFromPreviousGitCloneWhenRunningExperiments = true;
    return StaticConfiguration;
}());
exports.StaticConfiguration = StaticConfiguration;
