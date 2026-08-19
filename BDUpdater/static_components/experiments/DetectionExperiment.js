"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TapirResultForAllLibraries = exports.runNewPrecisionExperiments = exports.runNewDetectionExperiments = void 0;
var package_operations_1 = require("../package/package-operations");
var collections_1 = require("../util/collections");
var static_configuration_1 = require("../static-configuration");
var path_1 = require("path");
var async_1 = require("async");
var os_1 = require("os");
var file_1 = require("../util/file");
var parsing_1 = require("../util/parsing");
var logging_1 = require("../logging");
var tapir_1 = require("../pattern-finder/tapir");
var logger = (0, logging_1.createLogger)('DetectionExperiments', 'info');
var THROW_ERROR_IF_HIGH_CONFIDENCE_RESULT_IS_FALSE_POSITIVE = true;
function runNewDetectionExperiments(cb) {
    var experiments = ["lodash@4.0.0", "async@3.0.0", "express@4.0.0", "chalk@2.0.0", "bluebird@3.0.0", "uuid@3.0.0", "commander@3.0.0", "rxjs@6.0.0", "core-js@3.0.0", "yargs@14.0.0", "node-fetch@2.0.0", "winston@3.0.0", "redux@4.0.0", "jsonwebtoken@8.0.0", "mongoose@5.0.0"];
    runExperimentsWithPatchFile(experiments, "affected-clients", "detection-patterns", cb);
}
exports.runNewDetectionExperiments = runNewDetectionExperiments;
function runNewPrecisionExperiments(cb) {
    var experiments = ["lodash@4.0.0", "async@3.0.0", "express@4.0.0", "chalk@2.0.0", "bluebird@3.0.0", "uuid@3.0.0", "commander@3.0.0", "rxjs@6.0.0", "core-js@3.0.0", "yargs@14.0.0", "node-fetch@2.0.0", "winston@3.0.0", "redux@4.0.0", "jsonwebtoken@8.0.0", "mongoose@5.0.0"];
    runExperimentsWithPatchFile(experiments, "unaffected-clients", "detection-patterns", cb);
}
exports.runNewPrecisionExperiments = runNewPrecisionExperiments;
function runExperimentsWithPatchFile(experiments, patchDescriptionDirectory, breakingChangeDescriptionDirectory, cb) {
    var resArray = [];
    var resultCB = function (res) {
        resArray.push(res);
        if (resArray.length === experiments.length)
            cb(new TapirResultForAllLibraries(resArray));
    };
    experiments.forEach(function (exp) { return doExperiment(exp, "".concat(patchDescriptionDirectory, "/").concat(exp, ".patches.json"), "".concat(breakingChangeDescriptionDirectory, "/").concat(exp, ".json"), resultCB); });
}
function doExperiment(libraryName, patchLocation, breakingChangeDescriptionLocation, cb) {
    var patches = require((0, path_1.resolve)(static_configuration_1.StaticConfiguration.resPath, patchLocation));
    var patterns = require((0, path_1.resolve)(static_configuration_1.StaticConfiguration.resPath, breakingChangeDescriptionLocation));
    if (!static_configuration_1.StaticConfiguration.checkForDeprecations) {
        patterns = patterns.filter(function (bc) { return !bc.deprecation; });
    }
    var clientNames = Object.keys(patches);
    var resArray = [];
    var numberClientsProcessed = 0;
    var resultCB = function (res) {
        numberClientsProcessed++;
        if (res)
            resArray.push(res);
        if (numberClientsProcessed === clientNames.length)
            cb(new TapirResultForLibrary(libraryName, resArray));
    };
    clientNames.forEach(function (clientName) { return globalLimitClientTests.push({ patterns: patterns, clientPatches: patches[clientName], clientName: clientName, moduleName: libraryName.split("@")[0], resultCB: resultCB }); });
}
function testClient(patterns, clientPatches, clientName, moduleName) {
    return __awaiter(this, void 0, void 0, function () {
        var gitDir, filesToAnalyze, resultsForClient;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.info("Preparing client directory for client: ".concat(clientName));
                    return [4 /*yield*/, package_operations_1.PackageOperations.getPathToGitDir(clientPatches.repo.gitURL, clientPatches.repo.gitCommit, moduleName, clientName, clientPatches.install)];
                case 1:
                    gitDir = _a.sent();
                    return [4 /*yield*/, (0, file_1.getFilesToAnalyze)(gitDir, clientPatches.excludedFolders, clientPatches.excludedFiles)];
                case 2:
                    filesToAnalyze = _a.sent();
                    resultsForClient = new Map();
                    logger.info("Starting analysis of client: ".concat(clientName));
                    return [4 /*yield*/, Promise.all(filesToAnalyze.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                            var program, tapirResultsForFile_1, e_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, (0, parsing_1.parseFileWithRecast)(file)];
                                    case 1:
                                        program = _a.sent();
                                        tapirResultsForFile_1 = tapir_1.Tapir.runTapirOnFile((0, path_1.relative)(gitDir, file), program, patterns).getMatchPatternResults();
                                        patterns.forEach(function (pattern) {
                                            var patchesRelatedToFileAndPattern = clientPatches.patches.filter(function (p) { return file === "".concat(gitDir, "/").concat(p.file); }).filter(function (p) { return p.classification === pattern.id && [".js", ".es"].some(function (extension) { return !p.file.includes(".") || p.file.endsWith(extension); }); });
                                            if (!resultsForClient.has(pattern.id))
                                                resultsForClient.set(pattern.id, new Map());
                                            var tapirResultForFileAndPattern = testPatternOnFile(file, pattern, patchesRelatedToFileAndPattern, tapirResultsForFile_1.get(pattern));
                                            if (tapirResultForFileAndPattern.hasResults())
                                                resultsForClient.get(pattern.id).set(file, tapirResultForFileAndPattern);
                                        });
                                        return [3 /*break*/, 3];
                                    case 2:
                                        e_1 = _a.sent();
                                        logger.debug(e_1);
                                        if (e_1 instanceof Error) {
                                            if (e_1.message !== 'Failed parsing') {
                                                throw e_1;
                                            }
                                        }
                                        else {
                                            throw e_1; // or handle differently if not an Error
                                        }
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 3:
                    _a.sent();
                    logger.info("Finished analysis of client: ".concat(clientName));
                    return [2 /*return*/, new TapirResultForClient(resultsForClient)];
            }
        });
    });
}
function testPatternOnFile(fileName, pattern, patches, tapirResults) {
    var expectedChangesNotFound = []; // non-behavioral false negatives
    var expectedChangesFound = []; // non-behavioral true positives
    var unexpectedChangesFound = []; // non-behavioral false positives
    var expectedBehavioralChangesNotFound = []; // behavioral false negatives
    var expectedBehavioralChangesFound = []; // behavioral true positives
    var unexpectedBehavioralChangesFound = []; // behavioral false positives
    var notBenignCertainTruePositives = [];
    var lineNumbersWithPatternDetected = tapirResults.map(function (tmr) { return tmr.node.loc.start.line; });
    patches.forEach(function (p) {
        if (lineNumbersWithPatternDetected.includes(p.lineNumber)) {
            (pattern.question ? expectedBehavioralChangesFound : expectedChangesFound).push(new ExpectedChange(p.truePositive, p.lineNumber));
            if (!pattern.question && !pattern.benign && p.truePositive !== false)
                notBenignCertainTruePositives.push(p.lineNumber);
        }
        else {
            (pattern.question ? expectedBehavioralChangesNotFound : expectedChangesNotFound).push(new ExpectedChange(p.truePositive, p.lineNumber));
        }
    });
    var unexpectedChanges = tapirResults.filter(function (tmr) { return !patches.some(function (p) { return p.lineNumber === tmr.node.loc.start.line; }); });
    if (THROW_ERROR_IF_HIGH_CONFIDENCE_RESULT_IS_FALSE_POSITIVE) {
        unexpectedChanges.filter(function (tmr) { return !tmr.uncertainCallFilters && !tmr.uncertainAccPath; }).forEach(function (tmr) {
            var loc = tmr.node.loc;
            throw new Error("High confidence result in false positive: ".concat(tmr.node.type, ":").concat(fileName, ":").concat(loc.start.line, ":").concat(loc.start.column, ":").concat(pattern.id));
        });
    }
    var numberCertain = tapirResults.filter(function (tr) { return !tr.uncertainAccPath && !tr.uncertainCallFilters; }).length;
    var numberUncertain = tapirResults.filter(function (tr) { return tr.uncertainAccPath || tr.uncertainCallFilters; }).length;
    unexpectedChanges.forEach(function (unexpectedChange) { return (pattern.question ? unexpectedBehavioralChangesFound : unexpectedChangesFound).push(unexpectedChange.node.loc.start.line); });
    return new TapirResultForFileAndPattern(expectedChangesNotFound, expectedChangesFound, unexpectedChangesFound, expectedBehavioralChangesNotFound, expectedBehavioralChangesFound, unexpectedBehavioralChangesFound, notBenignCertainTruePositives, numberCertain, numberUncertain);
}
var globalLimitClientTests = (0, async_1.queue)(function (arg, cb) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = arg).resultCB;
                    return [4 /*yield*/, testClient(arg.patterns, arg.clientPatches, arg.clientName, arg.moduleName).catch(function (e) {
                            logger.error("Failed processing client ".concat(arg.clientName, " with error ").concat(e));
                            return undefined;
                        })];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    // // Notice, we use a separate callback for processing the result since passing a value to the 'actual' callback is
                    // // used to indicate an error.
                    // arg.resultCB(res);
                    cb();
                    return [2 /*return*/];
            }
        });
    });
}, (0, os_1.cpus)().length);
var ExpectedChange = /** @class */ (function () {
    function ExpectedChange(truePositive, lineNumber) {
        this.truePositive = truePositive;
        this.lineNumber = lineNumber;
    }
    ExpectedChange.prototype.toString = function () {
        return "".concat(this.lineNumber);
    };
    Object.defineProperty(ExpectedChange.prototype, Symbol.toStringTag, {
        get: function () {
            return "".concat(this.lineNumber);
        },
        enumerable: false,
        configurable: true
    });
    return ExpectedChange;
}());
var TapirResultForFileAndPattern = /** @class */ (function () {
    function TapirResultForFileAndPattern(expectedChangesNotFound, expectedChangesFound, unexpectedChangesFound, expectedBehavioralChangesNotFound, expectedBehavioralChangesFound, unexpectedBehavioralChangesFound, notBenignCertainTruePositives, numberCertain, numberUncertain) {
        this.expectedChangesNotFound = expectedChangesNotFound;
        this.expectedChangesFound = expectedChangesFound;
        this.unexpectedChangesFound = unexpectedChangesFound;
        this.expectedBehavioralChangesNotFound = expectedBehavioralChangesNotFound;
        this.expectedBehavioralChangesFound = expectedBehavioralChangesFound;
        this.unexpectedBehavioralChangesFound = unexpectedBehavioralChangesFound;
        this.notBenignCertainTruePositives = notBenignCertainTruePositives;
        this.numberCertain = numberCertain;
        this.numberUncertain = numberUncertain;
    }
    TapirResultForFileAndPattern.prototype.getExpectedChangesNotFound = function (behavioral) {
        return (behavioral ? this.expectedBehavioralChangesNotFound : this.expectedChangesNotFound).map(function (e) { return e.lineNumber; });
    };
    TapirResultForFileAndPattern.prototype.getExpectedChangesFound = function (behavioral) {
        return behavioral ? this.expectedBehavioralChangesFound : this.expectedChangesFound;
    };
    TapirResultForFileAndPattern.prototype.getUnexpectedChangesFound = function (behavioral) {
        return behavioral ? this.unexpectedBehavioralChangesFound : this.unexpectedChangesFound;
    };
    TapirResultForFileAndPattern.prototype.getTruePositives = function (behavioral) {
        return this.getExpectedChangesFound(behavioral).filter(function (expChg) { return expChg.truePositive; }).map(function (expChg) { return expChg.lineNumber; });
    };
    TapirResultForFileAndPattern.prototype.getFalsePositives = function (behavioral) {
        return this.getExpectedChangesFound(behavioral).filter(function (expChg) { return !expChg.truePositive; }).map(function (expChg) { return expChg.lineNumber; });
    };
    TapirResultForFileAndPattern.prototype.getNotBenignCertainTruePositives = function () {
        return this.notBenignCertainTruePositives;
    };
    TapirResultForFileAndPattern.prototype.getNumberCertain = function () {
        return this.numberCertain;
    };
    TapirResultForFileAndPattern.prototype.getNumberUncertain = function () {
        return this.numberUncertain;
    };
    TapirResultForFileAndPattern.prototype.hasResults = function () {
        return this.expectedChangesNotFound.length !== 0 ||
            this.expectedChangesFound.length !== 0 ||
            this.unexpectedChangesFound.length !== 0 ||
            this.expectedBehavioralChangesNotFound.length !== 0 ||
            this.expectedBehavioralChangesFound.length !== 0 ||
            this.unexpectedBehavioralChangesFound.length !== 0;
    };
    return TapirResultForFileAndPattern;
}());
var TapirResultForClient = /** @class */ (function () {
    function TapirResultForClient(results) {
        this.results = results;
    }
    TapirResultForClient.prototype.getNumberUncertain = function () {
        return this.sumResults(function (v) { return v.getNumberUncertain(); });
    };
    TapirResultForClient.prototype.getNumberCertain = function () {
        return this.sumResults(function (v) { return v.getNumberCertain(); });
    };
    TapirResultForClient.prototype.getExpectedChangesNotFound = function (behavioral) {
        return this.sumLengthsOfResultsArray(function (v) { return v.getExpectedChangesNotFound(behavioral); });
    };
    TapirResultForClient.prototype.getExpectedChangesFound = function (behavioral) {
        return this.sumLengthsOfResultsArray(function (v) { return v.getExpectedChangesFound(behavioral); });
    };
    TapirResultForClient.prototype.getUnexpectedChangesFound = function (behavioral) {
        return this.sumLengthsOfResultsArray(function (v) { return v.getUnexpectedChangesFound(behavioral); });
    };
    TapirResultForClient.prototype.unexpectedDetectionSummary = function (behavioral) {
        return this.summarizeResult(function (v) { return v.getUnexpectedChangesFound(behavioral); });
    };
    TapirResultForClient.prototype.falseNegativeSummary = function (behavioral) {
        return this.summarizeResult(function (v) { return v.getExpectedChangesNotFound(behavioral); });
    };
    /**
     * Reports all expected patches (including both true positives and false positives)
     */
    TapirResultForClient.prototype.expectedChangeSummary = function (behavioral) {
        return this.summarizeResult(function (v) { return v.getExpectedChangesFound(behavioral); });
    };
    TapirResultForClient.prototype.summarizeResult = function (transformValue) {
        return new Map(Array.from(this.results.entries(), function (_a) {
            var _b = __read(_a, 2), k = _b[0], v = _b[1];
            return [k, new Map(Array.from(v, function (_a) {
                    var _b = __read(_a, 2), k1 = _b[0], v1 = _b[1];
                    return [k1, transformValue(v1)];
                }).filter(function (_a) {
                    var _b = __read(_a, 2), _k1 = _b[0], v1 = _b[1];
                    return v1.length > 0;
                }))];
        }));
    };
    TapirResultForClient.prototype.sumLengthsOfResultsArray = function (transformValue) {
        return sum(__spreadArray([], __read(this.results.values()), false).map(function (v) { return sum(__spreadArray([], __read(v.values()), false).map(function (v2) { return transformValue(v2).length; })); }));
    };
    TapirResultForClient.prototype.sumResults = function (transformValue) {
        return sum(__spreadArray([], __read(this.results.values()), false).map(function (v) { return sum(__spreadArray([], __read(v.values()), false).map(function (v2) { return transformValue(v2); })); }));
    };
    /**
     * Reports only patches found marked as a true positive
     */
    TapirResultForClient.prototype.falsePositiveSummary = function (behavioral) {
        return this.summarizeResult(function (v) { return v.getFalsePositives(behavioral); });
    };
    TapirResultForClient.prototype.getFalsePositives = function (behavioral) {
        return this.sumLengthsOfResultsArray(function (v) { return v.getFalsePositives(behavioral); });
    };
    /**
     * Reports only patches found marked as a false positive
     */
    TapirResultForClient.prototype.truePositiveSummary = function (behavioral) {
        return this.summarizeResult(function (v) { return v.getTruePositives(behavioral); });
    };
    TapirResultForClient.prototype.getTruePositives = function (behavioral) {
        return this.sumLengthsOfResultsArray(function (v) { return v.getTruePositives(behavioral); });
    };
    TapirResultForClient.prototype.getNumberNotBenignCertainTPs = function () {
        return this.sumLengthsOfResultsArray(function (v) { return v.getNotBenignCertainTruePositives(); });
    };
    return TapirResultForClient;
}());
function addMapMapArrayToMapMapArray(target, source) {
    Array.from(source.keys()).forEach(function (k) {
        if (!target.has(k))
            target.set(k, new Map());
        (0, collections_1.addMapToMapArray)(target.get(k), source.get(k));
    });
}
var TapirResultForLibrary = /** @class */ (function () {
    function TapirResultForLibrary(library, results) {
        this.library = library;
        this.results = results;
    }
    TapirResultForLibrary.prototype.constructRQ1TableLine = function (showBcPerClient) {
        var numberClients = this.getNumberClients();
        var truePositivesNonBehavioral = this.getRQ1TruePositives(false);
        var truePositivesBehavioral = this.getRQ1TruePositives(true);
        var falsePositives = this.getRQ1FalsePositives(false) + this.getRQ1FalsePositives(true);
        var changesRequired = this.getNumberBreakingChanges(false) + this.getNumberBreakingChanges(true);
        var numberCertain = this.getNumberCertain();
        var numberNotBenignCertainTPs = this.getNumberNotBenignCertainTPs();
        return TapirResultForLibrary.constructRQ1TableLineFromData(this.library, numberClients, changesRequired, truePositivesNonBehavioral, truePositivesBehavioral, falsePositives, numberCertain, showBcPerClient, numberNotBenignCertainTPs);
    };
    TapirResultForLibrary.constructRQ1TableLineFromData = function (library, numberClients, changesRequired, truePositivesNonBehavioral, truePositivesBehavioral, falsePositives, numberCertain, showBcPerClient, numberNotBenignCertainTPs, showNotBenignTPT) {
        var totalTruePositives = truePositivesNonBehavioral + truePositivesBehavioral;
        var recall = (totalTruePositives / changesRequired) * 100;
        var tpFrac = (totalTruePositives / (totalTruePositives + falsePositives)) * 100;
        var res = [
            library,
            "" + numberClients,
            "" + recall + "%",
            "" + totalTruePositives,
            "" + truePositivesNonBehavioral,
            "" + truePositivesBehavioral,
            "" + falsePositives,
            "" + (Number.isNaN(tpFrac) ? 100 : tpFrac.toFixed(0)) + '%',
            "" + numberCertain
        ];
        if (showNotBenignTPT)
            res.push("" + numberNotBenignCertainTPs);
        if (showBcPerClient) {
            res.push("" + (changesRequired / numberClients).toFixed(1));
        }
        return res;
    };
    TapirResultForLibrary.prototype.getNumberClients = function () {
        return this.results.length;
    };
    TapirResultForLibrary.prototype.getNumberUncertain = function () {
        return sum(this.results.map(function (e) { return e.getNumberUncertain(); }));
    };
    TapirResultForLibrary.prototype.getNumberCertain = function () {
        return sum(this.results.map(function (e) { return e.getNumberCertain(); }));
    };
    TapirResultForLibrary.prototype.getNumberBreakingChanges = function (behavioral) {
        return this.getRQ1TruePositives(behavioral) + this.getRQ1FalseNegatives(behavioral);
    };
    TapirResultForLibrary.prototype.getRQ1FalsePositives = function (behavioral) {
        return sum(this.results.map(function (e) { return e.getUnexpectedChangesFound(behavioral); }));
    };
    TapirResultForLibrary.prototype.getRQ1FalseNegatives = function (behavioral) {
        return sum(this.results.map(function (e) { return e.getExpectedChangesNotFound(behavioral); }));
    };
    TapirResultForLibrary.prototype.getRQ1TruePositives = function (behavioral) {
        return sum(this.results.map(function (e) { return e.getExpectedChangesFound(behavioral); }));
    };
    TapirResultForLibrary.prototype.getNumberNotBenignCertainTPs = function () {
        return sum(this.results.map(function (e) { return e.getNumberNotBenignCertainTPs(); }));
    };
    TapirResultForLibrary.prototype.constructRQ2TableLine = function (showUnclassified, showExpectedNotFound, showNotBenignTPT) {
        var numberClients = this.getNumberClients();
        var clientsWithWarnings = this.getNumberClientsWithWarnings();
        var clientsWithTP = this.getNumberClientsWithTP();
        var clientsWithFP = this.getNumberClientsWithFP();
        var truePositivesNonBehavioral = this.getRQ2TruePositives(false);
        var truePositivesBehavioral = this.getRQ2TruePositives(true);
        var falsePositives = this.getRQ2FalsePositives(false) + this.getRQ2FalsePositives(true);
        var numberUnexpectedFound = this.getRQ2NumberUnexpectedFound(false) + this.getRQ2NumberUnexpectedFound(true);
        var numberExpectedNotFound = this.getRQ2NumberExpectedNotFound(false) + this.getRQ2NumberExpectedNotFound(true);
        var numberNotBenignCertainTPs = this.getNumberNotBenignCertainTPs();
        return TapirResultForLibrary.constructRQ2TableLineFromData(this.library, numberClients, clientsWithWarnings, clientsWithTP, clientsWithFP, truePositivesNonBehavioral, truePositivesBehavioral, falsePositives, numberUnexpectedFound, numberExpectedNotFound, this.getNumberCertain(), showUnclassified, showExpectedNotFound, numberNotBenignCertainTPs, showNotBenignTPT);
    };
    TapirResultForLibrary.prototype.getRQ2NumberExpectedNotFound = function (behavioral) {
        return sum(this.results.map(function (e) { return e.getExpectedChangesNotFound(behavioral); }));
    };
    TapirResultForLibrary.prototype.getRQ2NumberUnexpectedFound = function (behavioral) {
        return sum(this.results.map(function (e) { return e.getUnexpectedChangesFound(behavioral); }));
    };
    TapirResultForLibrary.prototype.getRQ2FalsePositives = function (behavioral) {
        return sum(this.results.map(function (e) { return e.getFalsePositives(behavioral); }));
    };
    TapirResultForLibrary.prototype.getRQ2TruePositives = function (behavioral) {
        return sum(this.results.map(function (e) { return e.getTruePositives(behavioral); }));
    };
    TapirResultForLibrary.prototype.getNumberClientsWithTP = function () {
        return this.results.filter(function (r) { return r.getTruePositives(false) > 0 || r.getTruePositives(true) > 0; }).length;
    };
    TapirResultForLibrary.prototype.getNumberClientsWithFP = function () {
        return this.results.filter(function (r) { return r.getFalsePositives(false) > 0 || r.getFalsePositives(true) > 0; }).length;
    };
    TapirResultForLibrary.prototype.getNumberClientsWithWarnings = function () {
        return this.results.filter(function (r) { return r.getExpectedChangesFound(false) > 0 || r.getExpectedChangesFound(true) > 0 || r.getUnexpectedChangesFound(false) > 0 || r.getUnexpectedChangesFound(true) > 0; }).length;
    };
    TapirResultForLibrary.constructRQ2TableLineFromData = function (library, numberClients, clientsWithWarnings, clientsWithTP, clientsWithFP, truePositivesNonBehavioral, truePositivesBehavioral, falsePositives, numberUnexpectedFound, numberExpectedNotFound, numberCertain, showUnclassified, showExpectedNotFound, numberNotBenignCertainTPs, showNotBenignTPT) {
        var totalTruePositives = truePositivesNonBehavioral + truePositivesBehavioral;
        var tpFrac = (totalTruePositives / (totalTruePositives + falsePositives)) * 100;
        var res = [
            library,
            "" + numberClients,
            "" + clientsWithWarnings,
            "" + clientsWithTP,
            "" + clientsWithFP,
            "" + totalTruePositives,
            "" + truePositivesNonBehavioral,
            "" + truePositivesBehavioral,
            "" + falsePositives,
            "" + (Number.isNaN(tpFrac) ? 100 : tpFrac.toFixed(0)) + '%',
            "" + numberCertain
        ];
        if (showNotBenignTPT)
            res.push("" + numberNotBenignCertainTPs);
        if (showUnclassified)
            res.push("" + numberUnexpectedFound);
        if (showExpectedNotFound)
            res.push("" + numberExpectedNotFound);
        return res;
    };
    TapirResultForLibrary.prototype.unexpectedDetectionSummary = function () {
        var res = new Map();
        this.results.forEach(function (re) { return addMapMapArrayToMapMapArray(res, re.unexpectedDetectionSummary(false)); });
        this.results.forEach(function (re) { return addMapMapArrayToMapMapArray(res, re.unexpectedDetectionSummary(true)); });
        return res;
    };
    TapirResultForLibrary.prototype.falseNegativeSummary = function () {
        var res = new Map();
        this.results.forEach(function (re) { return addMapMapArrayToMapMapArray(res, re.falseNegativeSummary(false)); });
        this.results.forEach(function (re) { return addMapMapArrayToMapMapArray(res, re.falseNegativeSummary(true)); });
        return res;
    };
    TapirResultForLibrary.prototype.expectedChangeSummary = function () {
        var res = new Map();
        this.results.forEach(function (re) { return addMapMapArrayToMapMapArray(res, re.expectedChangeSummary(false)); });
        this.results.forEach(function (re) { return addMapMapArrayToMapMapArray(res, re.expectedChangeSummary(true)); });
        return res;
    };
    return TapirResultForLibrary;
}());
var TapirResultForAllLibraries = /** @class */ (function () {
    function TapirResultForAllLibraries(results) {
        this.results = results;
    }
    TapirResultForAllLibraries.prototype.constructRQ1Table = function (showBcPerClient, showNotBenignTPT) {
        var table = [];
        table.push(['Library', '#Clients', 'Recall', '#TP', '#TP(T)', '#TP(U)', '#FP', 'Precision (TP%)', 'High confidence']);
        if (showNotBenignTPT)
            table[0].push('#Not benign TP(T)');
        if (showBcPerClient) {
            table[0].push('#BCs/#Clients');
        }
        this.results.forEach(function (res) { return table.push(res.constructRQ1TableLine(showBcPerClient)); });
        table.push(this.constructRQ1SummaryLine(showBcPerClient));
        return table;
    };
    TapirResultForAllLibraries.prototype.constructRQ1SummaryLine = function (showBcPerClient, showNotBenignTPT) {
        var numberClients = this.results.reduce(function (acc, elem) { return acc + elem.getNumberClients(); }, 0);
        var truePositivesNonBehavioral = this.results.reduce(function (acc, elem) { return acc + elem.getRQ1TruePositives(false); }, 0);
        var truePositivesBehavioral = this.results.reduce(function (acc, elem) { return acc + elem.getRQ1TruePositives(true); }, 0);
        var falsePositives = this.results.reduce(function (acc, elem) { return acc + elem.getRQ1FalsePositives(false) + elem.getRQ1FalsePositives(true); }, 0);
        var changesRequired = this.results.reduce(function (acc, elem) { return acc + elem.getNumberBreakingChanges(false) + elem.getNumberBreakingChanges(true); }, 0);
        var numberCertain = this.results.reduce(function (acc, elem) { return acc + elem.getNumberCertain(); }, 0);
        var numberNotBenignCertainTPs = this.results.reduce(function (acc, elem) { return acc + elem.getNumberNotBenignCertainTPs(); }, 0);
        return TapirResultForLibrary.constructRQ1TableLineFromData("Total", numberClients, changesRequired, truePositivesNonBehavioral, truePositivesBehavioral, falsePositives, numberCertain, showBcPerClient, numberNotBenignCertainTPs, showNotBenignTPT);
    };
    TapirResultForAllLibraries.prototype.constructRQ2Table = function (showUnclassified, showExpectedNotFound, showNotBenignTPT) {
        var table = [];
        table.push(['Library', '#Clients', '#Clients (warning)', '#Clients (TP)', '#Clients (FP)', '#TP', '#TP(T)', '#TP(U)', '#FP', 'Precision (TP%)', 'High confidence']);
        if (showNotBenignTPT)
            table[0].push('#Not benign TP(T)');
        if (showUnclassified) {
            table[0].push('#Unclassified');
        }
        if (showExpectedNotFound)
            table[0].push("Classified but not found");
        this.results.forEach(function (res) { return table.push(res.constructRQ2TableLine(showUnclassified, showExpectedNotFound, showNotBenignTPT)); });
        table.push(this.constructRQ2SummaryLine(showUnclassified, showExpectedNotFound, showNotBenignTPT));
        return table;
    };
    TapirResultForAllLibraries.prototype.constructRQ2SummaryLine = function (showUnclassified, showExpectedNotFound, showNotBenignTPT) {
        var numberClients = sum(this.results.map(function (r) { return r.getNumberClients(); }));
        var clientsWithWarnings = sum(this.results.map(function (r) { return r.getNumberClientsWithWarnings(); }));
        var clientsWithTP = sum(this.results.map(function (r) { return r.getNumberClientsWithTP(); }));
        var clientsWithFP = sum(this.results.map(function (r) { return r.getNumberClientsWithFP(); }));
        var truePositivesNonBehavioral = sum(this.results.map(function (r) { return r.getRQ2TruePositives(false); }));
        var truePositivesBehavioral = sum(this.results.map(function (r) { return r.getRQ2TruePositives(true); }));
        var falsePositives = sum(this.results.map(function (r) { return r.getRQ2FalsePositives(false) + r.getRQ2FalsePositives(true); }));
        var numberUnexpectedFound = sum(this.results.map(function (r) { return r.getRQ2NumberUnexpectedFound(false) + r.getRQ2NumberUnexpectedFound(true); }));
        var numberExpectedNotFound = sum(this.results.map(function (r) { return r.getRQ2NumberExpectedNotFound(false) + r.getRQ2NumberExpectedNotFound(true); }));
        var numberCertain = sum(this.results.map(function (r) { return r.getNumberCertain(); }));
        var numberNotBenignCertainTPs = sum(this.results.map(function (r) { return r.getNumberNotBenignCertainTPs(); }));
        return TapirResultForLibrary.constructRQ2TableLineFromData("Total", numberClients, clientsWithWarnings, clientsWithTP, clientsWithFP, truePositivesNonBehavioral, truePositivesBehavioral, falsePositives, numberUnexpectedFound, numberExpectedNotFound, numberCertain, showUnclassified, showExpectedNotFound, numberNotBenignCertainTPs, showNotBenignTPT);
    };
    /**
     * Returns a map from breaking change classification to all the false positives of that classification
     */
    TapirResultForAllLibraries.prototype.unexpectedChangeSummary = function () {
        var res = new Map();
        this.results.forEach(function (re) { return addMapMapArrayToMapMapArray(res, re.unexpectedDetectionSummary()); });
        return res;
    };
    TapirResultForAllLibraries.prototype.falseNegativeSummary = function () {
        var res = new Map();
        this.results.forEach(function (re) { return addMapMapArrayToMapMapArray(res, re.falseNegativeSummary()); });
        return res;
    };
    TapirResultForAllLibraries.prototype.expectedChangeSummary = function () {
        var res = new Map();
        this.results.forEach(function (re) { return addMapMapArrayToMapMapArray(res, re.expectedChangeSummary()); });
        return res;
    };
    return TapirResultForAllLibraries;
}());
exports.TapirResultForAllLibraries = TapirResultForAllLibraries;
function sum(arr) {
    return arr.reduce(function (acc, elem) { return acc + elem; }, 0);
}
