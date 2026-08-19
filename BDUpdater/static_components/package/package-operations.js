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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageOperations = void 0;
var child_process_1 = require("child_process");
var path_1 = require("path");
var util_1 = require("util");
var logging_1 = require("../logging");
var static_configuration_1 = require("../static-configuration");
var file_1 = require("../util/file");
var rimraf = require("rimraf");
var util_2 = require("../util/util");
var logger = (0, logging_1.createLogger)('package-operations', 'info');
var PackageOperations = /** @class */ (function () {
    function PackageOperations() {
    }
    /**
     * Performs an npm install
     */
    PackageOperations.npmInstall = function (path, docker) {
        return __awaiter(this, void 0, void 0, function () {
            var timeout, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        timeout = 1000 * 60 * 3;
                        if (!docker) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.dockerizedCommand('npm install', path, timeout)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, (0, util_1.promisify)(child_process_1.exec)('npm install', { cwd: path, timeout: timeout })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        logger.error("npm install failed for ".concat(path, ". Failed with error ").concat(e_1));
                        throw e_1;
                    case 6: return [2 /*return*/, path];
                }
            });
        });
    };
    PackageOperations.npmInstallAndBuild = function (gitDir, docker) {
        return __awaiter(this, void 0, void 0, function () {
            var timeout;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timeout = 3 * 60 * 1000;
                        if (!docker) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.npmInstall(gitDir, docker)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.dockerizedCommand('npm run-script build', gitDir, timeout)];
                    case 2: return [2 /*return*/, new Promise(function (resolve) {
                            (0, child_process_1.exec)("npm install", { cwd: gitDir, timeout: timeout, killSignal: 'SIGKILL' }, function (error, stdout, stderr) {
                                (0, util_1.promisify)(child_process_1.exec)('npm run-script build', { cwd: gitDir, timeout: timeout, killSignal: 'SIGKILL' })
                                    .catch(function (_) { return undefined; })
                                    .finally(function () { return resolve({ exit: (error === null || error === void 0 ? void 0 : error.code) || 0, signal: error === null || error === void 0 ? void 0 : error.signal, stdout: stdout, stderr: stderr }); });
                            });
                        })];
                }
            });
        });
    };
    /**
     * Clones and checks out the given repo and commit and returns the path in which the repo has been cloned.
     */
    PackageOperations.getPathToGitDir = function (gitURL, gitCommit, moduleName, clientName, install) {
        return __awaiter(this, void 0, void 0, function () {
            var resGitFolder, moduleGitFolder, _a, ret;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, file_1.createDirectoryIfMissing)(static_configuration_1.StaticConfiguration.gitPath)];
                    case 1:
                        _b.sent();
                        resGitFolder = "".concat(moduleName, "-").concat(clientName);
                        moduleGitFolder = (0, path_1.resolve)(static_configuration_1.StaticConfiguration.gitPath, resGitFolder);
                        _a = static_configuration_1.StaticConfiguration.useFilesFromPreviousGitCloneWhenRunningExperiments;
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, file_1.isDirectory)(moduleGitFolder)];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3:
                        if (_a)
                            return [2 /*return*/, moduleGitFolder];
                        return [4 /*yield*/, (0, util_1.promisify)(rimraf)(moduleGitFolder)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, (0, util_1.promisify)(child_process_1.exec)("git clone ".concat(gitURL, " ").concat(resGitFolder), { cwd: static_configuration_1.StaticConfiguration.gitPath })];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, (0, util_1.promisify)(child_process_1.exec)("git checkout ".concat(gitCommit), { cwd: moduleGitFolder })];
                    case 6:
                        _b.sent();
                        if (!install) return [3 /*break*/, 8];
                        return [4 /*yield*/, PackageOperations.npmInstallAndBuild(moduleGitFolder)];
                    case 7:
                        ret = _b.sent();
                        if (ret.exit !== 0) {
                            logger.warn("npm install or npm build for ".concat(moduleGitFolder, " failed with exit code ").concat(ret.exit, " and signal ").concat(ret.signal));
                            logger.warn("stderr: ".concat(ret.stderr));
                        }
                        _b.label = 8;
                    case 8: return [2 /*return*/, moduleGitFolder];
                }
            });
        });
    };
    PackageOperations.dockerizedCommand = function (command, cwd, timeoutMS) {
        var _this = this;
        return new Promise(function (res) { return __awaiter(_this, void 0, void 0, function () {
            var dockerHomeFolder, dockerCommand;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, util_2.Util.getHomeFolderInDockerContainer()];
                    case 1:
                        dockerHomeFolder = _a.sent();
                        dockerCommand = "docker run -v ".concat((0, path_1.resolve)(cwd), ":").concat((0, path_1.resolve)(dockerHomeFolder, 'cwd'), " --rm -t torp123/tapir:v1.1 bash -c 'cd cwd && ").concat(command, "'");
                        logger.debug("Running: ".concat(dockerCommand));
                        (0, child_process_1.exec)(dockerCommand, { timeout: timeoutMS }, function (error, stdout, stderr) {
                            res({ exit: (error === null || error === void 0 ? void 0 : error.code) || 0, signal: error === null || error === void 0 ? void 0 : error.signal, stdout: stdout, stderr: stderr });
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return PackageOperations;
}());
exports.PackageOperations = PackageOperations;
