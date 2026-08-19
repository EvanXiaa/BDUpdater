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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var table_1 = require("table");
var pattern_language_1 = require("../pattern-finder/pattern-language");
var commander_1 = __importDefault(require("commander"));
var promise_1 = require("../util/promise");
var static_configuration_1 = require("../static-configuration");
commander_1.default.arguments('')
    .description('Generate a table of statistics about the detection patterns in the res/detection-patterns folder. Reproduces table 2 and 3 in the paper.')
    .action(function () {
    return __awaiter(this, void 0, void 0, function () {
        function getTableRowFromResults(libName, results) {
            return [
                libName,
                "" + results.getNumberPatterns(),
                "" + results.getData().numberImportPatterns,
                "" + results.getData().numberReadPropertyPatterns,
                "" + results.getData().numberWritePropertyPatterns,
                "" + results.getData().numberCallPatterns,
                "" + (results.getData().patternLength / results.getNumberPatterns()).toFixed(2),
                "" + (results.getData().numberImportPathPattern / results.getNumberPatterns()).toFixed(2),
                "" + (results.getData().numberDisjunctionAccessPathPatterns / results.getNumberPatterns()).toFixed(2),
                "" + (results.getData().numberExclusionAccessPathPatterns / results.getNumberPatterns()).toFixed(2),
                "" + (results.getData().numberCallAccessPathPattern / results.getNumberPatterns()).toFixed(2),
                "" + (results.getData().numberWildCardAccessPathPatterns / results.getNumberPatterns()).toFixed(2),
                "" + (results.getData().numberPropertyPathPatterns / results.getNumberPatterns()).toFixed(2),
                "" + (results.getData().numberPotentiallyUnknownAccessPathPatterns / results.getNumberPatterns()).toFixed(2),
                "" + (results.getData().numberArgNumberFilters / results.getData().numberCallPatterns).toFixed(2),
                "" + (results.getData().numberTypeFilters / results.getData().numberCallPatterns).toFixed(2)
            ];
        }
        var libs, table, res, combinedResult;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    libs = ["lodash@4.0.0", "async@3.0.0", "express@4.0.0", "chalk@2.0.0", "bluebird@3.0.0", "uuid@3.0.0", "commander@3.0.0", "rxjs@6.0.0", "core-js@3.0.0", "yargs@14.0.0", "node-fetch@2.0.0", "winston@3.0.0", "redux@4.0.0", "jsonwebtoken@8.0.0", "mongoose@5.0.0"];
                    table = [];
                    res = [];
                    table.push([
                        "Library",
                        "#Patterns",
                        "#Import",
                        "#Read",
                        "#Write",
                        "#Call",
                        "Length",
                        "<M>",
                        ",",
                        "\\",
                        "()",
                        "**",
                        ".",
                        "?",
                        "[m, n]",
                        "TypeFilter"
                    ]);
                    return [4 /*yield*/, (0, promise_1.applySeries)(libs, function (lib) { return __awaiter(_this, void 0, void 0, function () {
                            var patchLocation, patternWrappers, resultsForLibrary, combinedResult;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        patchLocation = "detection-patterns/".concat(lib, ".json");
                                        patternWrappers = require((0, path_1.resolve)(static_configuration_1.StaticConfiguration.resPath, patchLocation));
                                        resultsForLibrary = [];
                                        return [4 /*yield*/, (0, promise_1.applySeries)(patternWrappers, function (patternWrapper) { return __awaiter(_this, void 0, void 0, function () {
                                                var parsedPattern, patternStatisticsCollector;
                                                return __generator(this, function (_a) {
                                                    if (patternWrapper.deprecation)
                                                        return [2 /*return*/];
                                                    parsedPattern = (0, pattern_language_1.parsePattern)(patternWrapper.pattern);
                                                    patternStatisticsCollector = new PatternStatisticsCollector();
                                                    collectPatternStatistics(parsedPattern, patternStatisticsCollector);
                                                    resultsForLibrary.push(patternStatisticsCollector);
                                                    return [2 /*return*/];
                                                });
                                            }); })];
                                    case 1:
                                        _a.sent();
                                        combinedResult = PatternStatisticsCollector.sum(resultsForLibrary);
                                        table.push(getTableRowFromResults(lib, combinedResult));
                                        res = res.concat(combinedResult);
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    combinedResult = PatternStatisticsCollector.sum(res);
                    table.push(getTableRowFromResults("Total", combinedResult));
                    console.log((0, table_1.table)(table));
                    return [2 /*return*/];
            }
        });
    });
});
function collectPatternStatistics(pattern, statisticsCollector) {
    if (pattern instanceof pattern_language_1.CallPattern) {
        statisticsCollector.registerCallPattern(pattern);
        pattern.filters.forEach(function (f) {
            if (f instanceof pattern_language_1.ArgTypeFilter)
                statisticsCollector.registerTypeFilter(f);
            else if (f instanceof pattern_language_1.NumArgsFilter)
                statisticsCollector.registerArgNumberFilter(f);
            else
                throw new Error("Unsupported filter type: " + f);
        });
        collectAccessPathPatternStatistics(pattern.accessPathPattern, statisticsCollector);
    }
    else if (pattern instanceof pattern_language_1.ImportPattern) {
        statisticsCollector.registerImportPattern(pattern);
        collectAccessPathPatternStatistics(pattern.importPathPattern, statisticsCollector);
    }
    else if (pattern instanceof pattern_language_1.ReadPropertyPattern) {
        statisticsCollector.registerReadPropertyPattern(pattern);
        collectAccessPathPatternStatistics(pattern.propertyPathPattern, statisticsCollector);
    }
    else if (pattern instanceof pattern_language_1.WritePropertyPattern) {
        statisticsCollector.registerWritePropertyPattern(pattern);
        collectAccessPathPatternStatistics(pattern.propertyPathPattern, statisticsCollector);
    }
    else {
        throw new Error("Unsupported pattern type: " + pattern);
    }
}
function collectAccessPathPatternStatistics(pattern, statisticsCollector) {
    return ((function collectPatternStatisticsHelper(pattern) {
        if (pattern instanceof pattern_language_1.CallAccessPathPattern) {
            statisticsCollector.registerCallAccessPathPattern(pattern);
            collectPatternStatisticsHelper(pattern.accessPathPattern);
        }
        else if (pattern instanceof pattern_language_1.ExclusionAccessPathPattern) {
            statisticsCollector.registerExclusionAccessPathPattern(pattern);
            collectPatternStatisticsHelper(pattern.includeAccPathPattern);
            collectPatternStatisticsHelper(pattern.excludeAccPathPattern);
        }
        else if (pattern instanceof pattern_language_1.DisjunctionAccessPathPattern) {
            statisticsCollector.registerDisjunctionAccessPathPattern(pattern);
            pattern.accessPathPatterns.forEach(collectPatternStatisticsHelper);
        }
        else if (pattern instanceof pattern_language_1.ImportPathPattern) {
            statisticsCollector.registerImportPathPattern(pattern);
            //TODO: should we register glob complexity?
        }
        else if (pattern instanceof pattern_language_1.PotentiallyUnknownAccessPathPattern) {
            statisticsCollector.registerPotentiallyUnknownAccessPathPattern(pattern);
            collectPatternStatisticsHelper(pattern.accessPathPattern);
        }
        else if (pattern instanceof pattern_language_1.PropertyPathPattern) {
            statisticsCollector.registerPropertyPathPattern(pattern);
            collectPatternStatisticsHelper(pattern.receiver);
        }
        else if (pattern instanceof pattern_language_1.WildcardAccessPathPattern) {
            statisticsCollector.registerWildCardAccessPathPattern(pattern);
            collectPatternStatisticsHelper(pattern.accessPathPattern);
        }
        else {
            throw new Error("Unsupported pattern type: " + pattern);
        }
    })(pattern));
}
var PatternStatisticsCollector = /** @class */ (function () {
    function PatternStatisticsCollector() {
        this.data = {
            patternLength: 0,
            numberCallPatterns: 0,
            numberImportPatterns: 0,
            numberReadPropertyPatterns: 0,
            numberWritePropertyPatterns: 0,
            numberCallAccessPathPattern: 0,
            numberTypeFilters: 0,
            numberArgNumberFilters: 0,
            numberExclusionAccessPathPatterns: 0,
            numberDisjunctionAccessPathPatterns: 0,
            numberImportPathPattern: 0,
            numberNegationAccessPathPattern: 0,
            numberPotentiallyUnknownAccessPathPatterns: 0,
            numberPropertyPathPatterns: 0,
            numberWildCardAccessPathPatterns: 0
        };
    }
    PatternStatisticsCollector.prototype.getData = function () {
        return this.data;
    };
    PatternStatisticsCollector.prototype.registerCallAccessPathPattern = function (_pattern) {
        this.data.patternLength++;
        this.data.numberCallAccessPathPattern++;
    };
    PatternStatisticsCollector.prototype.registerTypeFilter = function (_filter) {
        this.data.patternLength++;
        this.data.numberTypeFilters++;
    };
    PatternStatisticsCollector.prototype.registerArgNumberFilter = function (_filter) {
        this.data.patternLength++;
        this.data.numberArgNumberFilters++;
    };
    PatternStatisticsCollector.prototype.registerExclusionAccessPathPattern = function (_pattern) {
        this.data.patternLength++;
        this.data.numberExclusionAccessPathPatterns++;
    };
    PatternStatisticsCollector.prototype.registerDisjunctionAccessPathPattern = function (_pattern) {
        this.data.patternLength += _pattern.accessPathPatterns.length - 1;
        this.data.numberDisjunctionAccessPathPatterns++;
    };
    PatternStatisticsCollector.prototype.registerImportPathPattern = function (_pattern) {
        this.data.patternLength++;
        this.data.numberImportPathPattern++;
    };
    PatternStatisticsCollector.prototype.registerPotentiallyUnknownAccessPathPattern = function (_pattern) {
        this.data.patternLength++;
        this.data.numberPotentiallyUnknownAccessPathPatterns++;
    };
    PatternStatisticsCollector.prototype.registerPropertyPathPattern = function (_pattern) {
        this.data.patternLength++;
        this.data.numberPropertyPathPatterns++;
    };
    PatternStatisticsCollector.prototype.registerWildCardAccessPathPattern = function (_pattern) {
        this.data.patternLength++;
        this.data.numberWildCardAccessPathPatterns++;
    };
    PatternStatisticsCollector.prototype.registerCallPattern = function (_pattern) {
        this.data.numberCallPatterns++;
    };
    PatternStatisticsCollector.prototype.registerImportPattern = function (_pattern) {
        this.data.numberImportPatterns++;
    };
    PatternStatisticsCollector.prototype.registerReadPropertyPattern = function (_pattern) {
        this.data.numberReadPropertyPatterns++;
    };
    PatternStatisticsCollector.prototype.registerWritePropertyPattern = function (_pattern) {
        this.data.numberWritePropertyPatterns++;
    };
    PatternStatisticsCollector.sum = function (staticCollectors) {
        var res = new PatternStatisticsCollector();
        if (staticCollectors.length == 0)
            return res;
        Object.keys(staticCollectors[0].data).forEach(function (key) {
            // @ts-ignore
            res.data[key] = staticCollectors.reduce(function (acc, elem) { return acc + elem.data[key]; }, 0);
        });
        return res;
    };
    PatternStatisticsCollector.prototype.getNumberPatterns = function () {
        return this.data.numberImportPatterns + this.data.numberReadPropertyPatterns + this.data.numberWritePropertyPatterns + this.data.numberCallPatterns;
    };
    return PatternStatisticsCollector;
}());
commander_1.default.parse(process.argv);
