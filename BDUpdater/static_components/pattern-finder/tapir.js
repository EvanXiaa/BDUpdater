"use strict";
/**
 * Use https://astexplorer.net/ for debugging/understanding the structure of AST
 * nodes.
 */
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
exports.Tapir = void 0;
var ast_utils_1 = require("../util/ast-utils");
var collections_1 = require("../util/collections");
var pattern_language_1 = require("./pattern-language");
var static_configuration_1 = require("../static-configuration");
var recast_1 = require("recast");
var tapir_interactive_1 = require("../interactive/tapir-interactive");
var access_path_1 = require("./access-path");
var file_1 = require("../util/file");
var parsing_1 = require("../util/parsing");
var path_1 = require("path");
var Tapir = /** @class */ (function () {
    function Tapir(fileName, module, treatRelativeRequiresAsUnknown) {
        if (treatRelativeRequiresAsUnknown === void 0) { treatRelativeRequiresAsUnknown = true; }
        this.fileName = fileName;
        this.module = module;
        this.unknownRequires = new Set();
        this.declaredVariableNames = new Set();
        this.treatRelativeRequiresAsUnknown = treatRelativeRequiresAsUnknown;
    }
    Tapir.createTapirFromFileName = function (fileName) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = Tapir.bind;
                        _b = [void 0, fileName];
                        return [4 /*yield*/, (0, parsing_1.parseFileWithRecast)(fileName)];
                    case 1: return [2 /*return*/, new (_a.apply(Tapir, _b.concat([_c.sent(), false])))()];
                }
            });
        });
    };
    Tapir.prototype.getDeclAnalysisResults = function () {
        if (!this.declarationAnalysisResults)
            throw new Error("The declaration analysis has not been run yet.");
        return this.declarationAnalysisResults;
    };
    Tapir.prototype.getModuleNameToVariableMap = function () {
        if (!this.moduleNameToVariableMap)
            throw new Error("The declaration analysis has not been run yet.");
        return this.moduleNameToVariableMap;
    };
    Tapir.prototype.getDeclaredVariableNames = function () {
        return this.declaredVariableNames;
    };
    Tapir.prototype.getAliasAnalysisResults = function () {
        if (!this.aliasAnalysisResults)
            throw new Error("The alias analysis has not been run yet.");
        return this.aliasAnalysisResults;
    };
    Tapir.prototype.getComputeAccessPathsResults = function () {
        if (!this.computeAccessPathsResults)
            throw new Error("The compute access paths phase has not been run yet.");
        return this.computeAccessPathsResults;
    };
    Tapir.prototype.getMatchPatternResults = function () {
        if (!this.matchPatternResults)
            throw new Error("The match pattern phase has not been run yet.");
        return this.matchPatternResults;
    };
    Tapir.prototype.declarationAnalysis = function () {
        var res = new Map();
        var moduleNameToVariable = new Map();
        var tapir = this;
        var state = new Map();
        function handleParams(params, node) {
            params.filter(function (p) { return (0, ast_utils_1.isIdentifier)(p); }).forEach(function (p) {
                tapir.declaredVariableNames.add(p.name);
                state.set(p.name, node);
            });
            params.filter(function (p) { return (0, ast_utils_1.isObjectPattern)(p); }).forEach(function (p) {
                p.properties.forEach(function (prop) {
                    // @ts-ignore
                    if ((0, ast_utils_1.isIdentifier)(prop.key)) {
                        // @ts-ignore
                        tapir.declaredVariableNames.add(prop.key.name);
                        // @ts-ignore
                        state.set(prop.key.name, node);
                    }
                });
            });
            params.filter(function (p) { return (0, ast_utils_1.isAssignmentPattern)(p); }).forEach(function (p) {
                var left = p.left;
                if ((0, ast_utils_1.isIdentifier)(left)) {
                    tapir.declaredVariableNames.add(left.name);
                    state.set(p.name, node);
                }
            });
        }
        (0, recast_1.visit)(this.module, {
            visitImportDeclaration: function (path) {
                var node = path.node;
                node.specifiers.forEach(function (spec) {
                    tapir.declaredVariableNames.add(spec.local.name);
                    state.set(spec.local.name, spec);
                    // @ts-ignore
                    spec.SOURCE = node.source.value;
                });
                node.specifiers.filter(function (spec) { return (0, ast_utils_1.isImportDefaultSpecifier)(spec) || (0, ast_utils_1.isImportNamespaceSpecifier)(spec); })
                    .forEach(function (spec) {
                    // @ts-ignore
                    moduleNameToVariable.set(node.source.value, spec.local.name);
                });
                this.traverse(path);
            },
            visitVariableDeclaration: function (path) {
                var node = path.node;
                node.declarations.filter(function (decl) { return (0, ast_utils_1.isIdentifier)(decl.id); }).forEach(function (decl) {
                    tapir.declaredVariableNames.add(decl.id.name);
                    state.set(decl.id.name, decl);
                });
                node.declarations.filter(function (decl) { return (0, ast_utils_1.isObjectPattern)(decl.id); }).forEach(function (decl) {
                    return decl.id.properties.forEach(function (p) {
                        // @ts-ignore
                        if ((0, ast_utils_1.isIdentifier)(p.value)) {
                            // @ts-ignore
                            tapir.declaredVariableNames.add(p.value.name);
                            // @ts-ignore
                            state.set(p.value.name, p);
                            // @ts-ignore
                            p.INIT_EXP = decl.init;
                        }
                    });
                });
                node.declarations.filter(function (decl) { return (0, ast_utils_1.isIdentifier)(decl.id); }).filter(function (decl) { return (0, ast_utils_1.isRequireCall)(decl.init); })
                    .forEach(function (decl) {
                    // @ts-ignore
                    moduleNameToVariable.set(decl.init.arguments[0].value, decl.id.name);
                });
                this.traverse(path);
            },
            visitFunctionDeclaration: function (path) {
                var node = path.node;
                if ((0, ast_utils_1.isIdentifier)(node.id))
                    state.set(node.id.name, node);
                var oldState = new Map(state);
                handleParams(node.params, node);
                this.traverse(path);
                state = oldState;
            },
            visitFunctionExpression: function (path) {
                var node = path.node;
                var oldState = new Map(state);
                if ((0, ast_utils_1.isIdentifier)(node.id))
                    state.set(node.id.name, node);
                handleParams(node.params, node);
                this.traverse(path);
                state = oldState;
            },
            visitArrowFunctionExpression: function (path) {
                var node = path.node;
                var oldState = new Map(state);
                handleParams(node.params, node);
                this.traverse(path);
                state = oldState;
            },
            visitIdentifier: function (path) {
                var node = path.node;
                if (!state.has(node.name) ||
                    ((0, ast_utils_1.isVariableDeclarator)(path.parent.node) && path.parent.node.id === node) ||
                    (0, ast_utils_1.isFunctionDeclaration)(path.parent.node) ||
                    (0, ast_utils_1.isImportSpecifier)(path.parent.node)) {
                    this.traverse(path);
                    return;
                }
                res.set(node, state.get(node.name));
                this.traverse(path);
            },
            visitAssignmentExpression: function (path) {
                var node = path.node;
                if ((0, ast_utils_1.isIdentifier)(node.left) && !state.has(node.left.name)) {
                    state.set(node.left.name, node);
                    res.set(node.left, node);
                }
                else if ((0, ast_utils_1.isIdentifier)(node.left) && state.has(node.left.name)) {
                    res.set(node.left, state.get(node.left.name));
                }
                else if ((0, ast_utils_1.isMemberExpression)(node.left) && (0, ast_utils_1.isIdentifier)(node.left.object) && state.has(node.left.object.name)) {
                    res.set(node.left.object, state.get(node.left.object.name));
                }
                if ((0, ast_utils_1.isRequireCall)(node.right) && (0, ast_utils_1.isIdentifier)(node.left))
                    // @ts-ignore
                    moduleNameToVariable.set(node.right.arguments[0].value, node.left.name);
                this.traverse(path);
            }
        });
        this.declarationAnalysisResults = res;
        this.moduleNameToVariableMap = moduleNameToVariable;
        return res;
    };
    Tapir.prototype.aliasAnalysis = function () {
        if (!this.declarationAnalysisResults)
            this.declarationAnalysis();
        var res = new Map();
        var tapir = this;
        (0, recast_1.visit)(this.module, {
            visitImportDeclaration: function (path) {
                var node = path.node;
                node.specifiers.forEach(function (spec) { return (0, collections_1.addToMapSet)(res, spec, spec); });
                this.traverse(path);
            },
            visitVariableDeclaration: function (path) {
                var node = path.node;
                node.declarations.filter(function (decl) { return (0, ast_utils_1.isIdentifier)(decl.id); }).filter(function (decl) { return !!decl.init; }).forEach(function (decl) { return (0, collections_1.addToMapSet)(res, decl, decl.init); });
                node.declarations.filter(function (decl) { return (0, ast_utils_1.isObjectPattern)(decl.id); }).filter(function (decl) { return !!decl.init; }).forEach(function (decl) {
                    return decl.id.properties.forEach(function (p) { return (0, collections_1.addToMapSet)(res, p, p); });
                });
                this.traverse(path);
            },
            visitAssignmentExpression: function (path) {
                var node = path.node;
                if ((0, ast_utils_1.isIdentifier)(node.left) && tapir.getDeclAnalysisResults().has(node.left)) {
                    (0, collections_1.addToMapSet)(res, tapir.getDeclAnalysisResults().get(node.left), node.right);
                }
                else if ((0, ast_utils_1.isMemberExpression)(node.left) && (0, ast_utils_1.isIdentifier)(node.left.property) && typeof node.left.property.name === "string") {
                    (0, collections_1.addToMapSet)(res, node.left.property.name, node.right);
                }
                this.traverse(path);
            },
            visitObjectExpression: function (path) {
                var node = path.node;
                // @ts-ignore
                node.properties.filter(function (prop) { return (0, ast_utils_1.isIdentifier)(prop.key); }).forEach(function (prop) { return (0, collections_1.addToMapSet)(res, prop.key.name, prop.value); });
                this.traverse(path);
            }
        });
        this.aliasAnalysisResults = res;
        return res;
    };
    Tapir.prototype.computeAccessPathsPhase = function () {
        if (!this.aliasAnalysisResults)
            this.aliasAnalysis();
        var res = new Map();
        var tapir = this;
        (0, recast_1.visit)(this.module, {
            visitMemberExpression: function (path) {
                var node = path.node;
                if (!isLeftHandSideInAssignment(path))
                    res.set(node, tapir.computeAccessPaths(node, tapir));
                this.traverse(path);
            },
            visitCallExpression: function (path) {
                var node = path.node;
                var accessPathNode;
                if ((0, ast_utils_1.isMemberExpression)(node.callee) && (0, ast_utils_1.isIdentifier)(node.callee.property) && (['call', 'apply'].includes(node.callee.property.name)))
                    accessPathNode = node.callee.object;
                else if ((0, ast_utils_1.isRequireCall)(node))
                    accessPathNode = node;
                else
                    accessPathNode = node.callee;
                res.set(node, tapir.computeAccessPaths(accessPathNode, tapir));
                this.traverse(path);
            },
            visitNewExpression: function (path) {
                var node = path.node;
                res.set(node, tapir.computeAccessPaths(node.callee, tapir));
                this.traverse(path);
            },
            visitIdentifier: function (path) {
                var node = path.node;
                if ((0, ast_utils_1.isImportSpecifier)(tapir.getDeclAnalysisResults().get(node)))
                    res.set(node, tapir.computeAccessPaths(node, tapir));
                this.traverse(path);
            },
            visitAssignmentExpression: function (path) {
                var node = path.node;
                if ((0, ast_utils_1.isMemberExpression)(node.left) && (0, ast_utils_1.isIdentifier)(node.left.property)) {
                    res.set(node, tapir.computeAccessPaths(node.left, tapir, true));
                }
                this.traverse(path);
            },
            visitImportDeclaration: function (path) {
                var node = path.node;
                node.specifiers.forEach(function (spec) { return res.set(spec, tapir.computeAccessPaths(spec, tapir)); });
                res.set(node, tapir.computeAccessPaths(node, tapir));
                this.traverse(path);
            }
        });
        this.computeAccessPathsResults = res;
        return res;
    };
    Tapir.prototype.computeAccessPaths = function (node, tapir, isAssignmentNode) {
        function lookup(x, visited) {
            if (!tapir.getAliasAnalysisResults().has(x))
                return typeof x === "string" ? new Set() : new Set([access_path_1.unknownAccessPathInstance]);
            if (visited.has(x))
                return new Set();
            if (typeof x === "string" && tapir.getAliasAnalysisResults().get(x).size > 30)
                return new Set([access_path_1.unknownAccessPathInstance]);
            visited.add(x);
            return (0, collections_1.setUnion)(__spreadArray([], __read(tapir.getAliasAnalysisResults().get(x)), false).map(function (n) { return computePaths(n, new Set(visited)); }));
        }
        function computePaths(n, visited) {
            var res;
            if (n.type =="Identifier" && n.name == "onFID")
                console.log()
            if ((0, ast_utils_1.isModuleImport)(n)) {
                res = new Set([tapir.getImportAccessPath(n)]);
            }
            else if ((0, ast_utils_1.isMemberExpression)(n) && (0, ast_utils_1.isIdentifier)(n.property)) {
                res = new Set(__spreadArray([], __read(computePaths(n.object, new Set(visited))), false).map(function (acc) { return new access_path_1.PropAccessPath(acc, n.property.name); }));
                if (node !== n || !isAssignmentNode)
                    __spreadArray([], __read(lookup(n.property.name, visited)), false).forEach(function (acc) { return res.add(acc); });
            }
            else if ((0, ast_utils_1.isIdentifier)(n)) {
                if (!tapir.getDeclAnalysisResults().has(n))
                    // @ts-ignore
                    res = new Set([globalObjects[n.name] || access_path_1.unknownAccessPathInstance]);
                else if ((0, ast_utils_1.isAnyCreateFunctionNode)(tapir.getDeclAnalysisResults().get(n)))
                    res = new Set([access_path_1.unknownAccessPathInstance]);
                else
                    res = lookup(tapir.getDeclAnalysisResults().get(n), visited);
            }
            else if ((0, ast_utils_1.isCallExpression)(n)) {
                res = new Set(__spreadArray([], __read(computePaths(n.callee, visited)), false).map(function (acc) { return new access_path_1.CallAccessPath(acc); }));
            }
            else if ((0, ast_utils_1.isProperty)(n)) {
                // @ts-ignore
                var accPaths = computePaths(n.INIT_EXP, visited);
                res = new Set(__spreadArray([], __read(accPaths), false).map(function (accPath) { return new access_path_1.PropAccessPath(accPath, n.key.name); }));
            }
            else if ((0, ast_utils_1.isArrayExpression)(n)) {
                res = new Set([globalObjects.Array]);
            }
            else if ((0, ast_utils_1.isObjectExpression)(n)) {
                res = new Set([globalObjects.Object]);
            }
            else if ((0, ast_utils_1.isParenthesizedExpression)(n)) {
                // @ts-ignore
                res = new Set(computePaths(n.expression, visited));
            }
            else if ((0, ast_utils_1.isThisExpression)(n)) {
                res = new Set([new access_path_1.ThisAccessPath()]);
            }
            else {
                res = new Set([access_path_1.unknownAccessPathInstance]);
            }
            return res;
        }
        return computePaths(node, new Set());
    };
    Tapir.prototype.getImportAccessPath = function (n) {
        var importString = undefined;
        if ((0, ast_utils_1.isRequireCall)(n) && (0, ast_utils_1.isSimpleLiteral)(n.arguments[0]) && typeof n.arguments[0].value === "string") {
            importString = n.arguments[0].value;
        }
        else if ((0, ast_utils_1.isImportDefaultSpecifier)(n) || (0, ast_utils_1.isImportNamespaceSpecifier)(n) || (0, ast_utils_1.isImportSpecifier)(n)) {
            // @ts-ignore
            importString = n.SOURCE;
        }
        else if ((0, ast_utils_1.isImportDeclaration)(n)) {
            // @ts-ignore
            importString = n.source.value;
        }
        if (!importString || (this.treatRelativeRequiresAsUnknown && importString.startsWith(".")))
            return access_path_1.unknownAccessPathInstance;
        var importAccessPath = new access_path_1.ImportAccessPath(importString);
        if ((0, ast_utils_1.isImportSpecifier)(n))
            return new access_path_1.PropAccessPath(importAccessPath, n.local.name);
        return importAccessPath;
    };
    Tapir.prototype.matchPattern = function (patternWrapper) {
        var pattern = (0, pattern_language_1.parsePattern)(patternWrapper.pattern);
        if (!this.computeAccessPathsResults)
            this.computeAccessPathsPhase();
        if (pattern instanceof pattern_language_1.ImportPattern)
            return this.matchImportPattern(pattern);
        else if (pattern instanceof pattern_language_1.ReadPropertyPattern)
            return this.matchReadPropertyPattern(pattern);
        else if (pattern instanceof pattern_language_1.WritePropertyPattern)
            return this.matchWritePropertyPattern(pattern);
        else if (pattern instanceof pattern_language_1.CallPattern)
            return this.matchCallPattern(pattern);
        throw new Error("Unsupported pattern: ".concat(pattern));
    };
    Tapir.prototype.matchImportPattern = function (pattern) {
        var res = [];
        var tapir = this;
        var computedAccessPaths = this.getComputeAccessPathsResults();
        (0, recast_1.visit)(this.module, {
            visitCallExpression: function (path) {
                this.traverse(path);
                var n = path.node;
                if (!n.loc || !(0, ast_utils_1.isRequireCall)(n) || pattern.onlyDefault)
                    return;
                pushTapirResultIfMaybeTrue(computedAccessPaths.get(n), n, tapir.fileName, res, tapir.doesAnyAccessPathMatchPattern(pattern.importPathPattern, computedAccessPaths.get(n)));
            },
            visitImportDeclaration: function (path) {
                this.traverse(path);
                var n = path.node;
                if (!n.loc || typeof n.source.value !== 'string')
                    return;
                var specMatch = n.specifiers.filter(function (spec) { return !pattern.onlyDefault || (0, ast_utils_1.isImportDefaultSpecifier)(spec); })
                    .some(function (spec) { return tapir.doesAnyAccessPathMatchPattern(pattern.importPathPattern, computedAccessPaths.get(spec)); });
                var nodeMatch = !pattern.onlyDefault && tapir.doesAnyAccessPathMatchPattern(pattern.importPathPattern, computedAccessPaths.get(n));
                pushTapirResultIfMaybeTrue(computedAccessPaths.get(n),n, tapir.fileName, res, specMatch, nodeMatch);
            }
        });
        return res;
    };
    Tapir.prototype.matchReadPropertyPattern = function (pattern) {
        var res = [];
        var tapir = this;
        var computedAccessPaths = this.getComputeAccessPathsResults();
        (0, recast_1.visit)(this.module, {
            visitMemberExpression: function (path) {
                this.traverse(path);
                if (isLeftHandSideInAssignment(path))
                    return;
                var n = path.node;
                if (!n.loc || !(0, ast_utils_1.isIdentifier)(n.property) || n.computed)
                    return;
                if (pattern.notInvoked && isCallee(path))
                    return;
                pushTapirResultIfMaybeTrue(computedAccessPaths.get(n), n, tapir.fileName, res, tapir.doesAnyAccessPathMatchPattern(pattern.propertyPathPattern, computedAccessPaths.get(n)));
            },
            visitImportDeclaration: function (path) {
                this.traverse(path);
                var n = path.node;
                if (!n.loc)
                    return;
                if (n.specifiers.filter(ast_utils_1.isImportSpecifier).some(function (spec) { return tapir.doesAnyAccessPathMatchPattern(pattern.propertyPathPattern, computedAccessPaths.get(spec)); })) {
                    pushTapirResultIfMaybeTrue(computedAccessPaths.get(n), n, tapir.fileName, res, true);
                }
            },
            visitIdentifier: function (path) {
                this.traverse(path);
                var n = path.node;
                if (!n.loc || !computedAccessPaths.has(n))
                    return;
                if (pattern.notInvoked && isCallee(path))
                    return;
                pushTapirResultIfMaybeTrue(computedAccessPaths.get(n), n, tapir.fileName, res, tapir.doesAnyAccessPathMatchPattern(pattern.propertyPathPattern, computedAccessPaths.get(n)));
            },
        });
        return res;
    };
    Tapir.prototype.matchWritePropertyPattern = function (pattern) {
        var res = [];
        var tapir = this;
        var computedAccessPaths = this.getComputeAccessPathsResults();
        (0, recast_1.visit)(this.module, {
            visitAssignmentExpression: function (path) {
                this.traverse(path);
                var n = path.node;
                if (!n.loc || !(0, ast_utils_1.isMemberExpression)(n.left) || !(0, ast_utils_1.isIdentifier)(n.left.property) || n.left.computed)
                    return;
                pushTapirResultIfMaybeTrue(computedAccessPaths.get(n), n, tapir.fileName, res, tapir.doesAnyAccessPathMatchPattern(pattern.propertyPathPattern, computedAccessPaths.get(n)));
            }
        });
        return res;
    };
    Tapir.prototype.matchCallPattern = function (pattern) {
        var res = [];
        var tapir = this;
        var computedAccessPaths = this.getComputeAccessPathsResults();
        var handleCall = function (path) {
            this.traverse(path);
            var n = path.node;
            // @ts-ignore
            var callee = (0, ast_utils_1.isParenthesizedExpression)(n.callee) ? n.callee.expression : n.callee;
            // if (callee.type == "Identifier" && callee.name == "onFID")
            //     console.log(callee.name);
            if (!n.loc || (0, ast_utils_1.isRequireCall)(n) || (!(0, ast_utils_1.isIdentifier)(callee) && !(0, ast_utils_1.isMemberExpression)(callee)))
                return;
            if (pattern.onlyReturnChanged && (0, ast_utils_1.isExpressionStatement)(path.parent.node))
                return;
            var isFunProtoCall = (0, ast_utils_1.isMemberExpression)(callee) && (0, ast_utils_1.isIdentifier)(callee.property) && callee.property.name === 'call';
            var isFunProtoApply = (0, ast_utils_1.isMemberExpression)(callee) && (0, ast_utils_1.isIdentifier)(callee.property) && callee.property.name === 'apply';
            var accPathMatch = tapir.doesAnyAccessPathMatchPattern(pattern.accessPathPattern, computedAccessPaths.get(n));
            if (!accPathMatch)
                return;
            var filterUncertainties = [];
            if (!isFunProtoApply && !n.arguments.some(function (arg) { return (0, ast_utils_1.isSpreadElement)(arg); })) {
                var args_1 = !isFunProtoCall ? n.arguments : n.arguments.slice(1);
                var filterMatches = pattern.filters.map(function (f) { return f.matches(args_1); });
                if (filterMatches.some(function (fm) { return fm === tapir_interactive_1.FALSE_RESULT_INSTANCE; }))
                    return false;
                filterMatches.filter(function (fm) { return fm instanceof tapir_interactive_1.MaybeArgTypeMatch || fm instanceof tapir_interactive_1.DisjunctionMatchResult; }).forEach(function (fm) { return filterUncertainties.push(fm); });
            }
            else if (pattern.filters.length > 0) {
                filterUncertainties.push(new tapir_interactive_1.MaybeApplyOrSpreadArgFilterMatch(pattern.filters));
            }
            pushTapirResultIfMaybeTrue(computedAccessPaths.get(n), n, tapir.fileName, res, accPathMatch, false, filterUncertainties);
        };
        (0, recast_1.visit)(this.module, {
            visitCallExpression: handleCall,
            visitNewExpression: handleCall
        });
        return res;
    };
    Tapir.prototype.doesAnyAccessPathMatchPattern = function (pattern, computedAccessPaths) {
        var _this = this;
        var matchResults = __spreadArray([], __read(computedAccessPaths), false).map(function (accPath)
        { return pattern.matches(accPath, _this.unknownRequires); });
        if (matchResults.some(function (mr) { return mr instanceof tapir_interactive_1.MaybeAccPathMatch || mr instanceof tapir_interactive_1.MaybeImportPathMatch; }) ||
            matchResults.some(function (mr) { return mr === tapir_interactive_1.FALSE_RESULT_INSTANCE; }) && matchResults.some(function (mr) { return mr === tapir_interactive_1.TRUE_RESULT_INSTANCE; })) // Multiple acc paths, but only some match
            return new tapir_interactive_1.UncertainAccPathMatch();
        return matchResults.some(function (mr) { return mr === tapir_interactive_1.TRUE_RESULT_INSTANCE; });
    };
    Tapir.runTapirOnDirectory = function (dirName, patternDescriptionFile, excludedFolders) {
        return __awaiter(this, void 0, void 0, function () {
            var res, patternDescriptionFileAbsolute, patterns, filesToAnalyze;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        res = new Map();
                        patternDescriptionFileAbsolute = (0, path_1.isAbsolute)(patternDescriptionFile) ? patternDescriptionFile : (0, path_1.resolve)(static_configuration_1.StaticConfiguration.projectHome, patternDescriptionFile);
                        patterns = require(patternDescriptionFileAbsolute);
                        if (!static_configuration_1.StaticConfiguration.checkForDeprecations) {
                            patterns = patterns.filter(function (bc) { return !bc.deprecation; });
                        }
                        return [4 /*yield*/, (0, file_1.getFilesToAnalyze)(dirName, excludedFolders)];
                    case 1:
                        filesToAnalyze = _a.sent();
                        return [4 /*yield*/, Promise.all(filesToAnalyze.map(function (file) { return __awaiter(_this, void 0, void 0, function () {
                                var program, relFileName, tapirResultsForFile, e_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, (0, parsing_1.parseFileWithRecast)(file)];
                                        case 1:
                                            program = _a.sent();
                                            relFileName = (0, path_1.relative)(dirName, file);
                                            // console.log(relFileName)
                                            tapirResultsForFile = Tapir.runTapirOnFile(relFileName, program, patterns).getMatchPatternResults();
                                            res.set(relFileName, tapirResultsForFile);
                                            return [3 /*break*/, 3];
                                        case 2:
                                            e_1 = _a.sent();
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
                    case 2:
                        _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    Tapir.runTapirOnFile = function (fileName, module, patterns) {
        var res = new Map();
        var tapir = new Tapir(fileName, module);
        if (static_configuration_1.StaticConfiguration.assumeFirstReceiverMatchOnUnknownLibraryObject)
            tapir.computeUnknownRequires(module);
        patterns.forEach(function (pattern) { return res.set(pattern, tapir.matchPattern(pattern)); });
        tapir.matchPatternResults = res;
        return tapir;
    };
    Tapir.prototype.computeUnknownRequires = function (module) {
        var res = new Set();
        (0, recast_1.visit)(module, {
            visitCallExpression: function (path) {
                this.traverse(path);
                var n = path.node;
                n.arguments.filter(ast_utils_1.isCallExpression)
                    .filter(ast_utils_1.isRequireCall)
                    .map(function (n) { return n.arguments[0]; })
                    .forEach(function (requireArg) {
                    if ((0, ast_utils_1.isSimpleLiteral)(requireArg) && typeof requireArg.value === 'string')
                        res.add(new access_path_1.ImportAccessPath(requireArg.value));
                });
            }
        });
        this.unknownRequires = res;
        return res;
    };
    return Tapir;
}());
exports.Tapir = Tapir;
var globalObjects = {
    "JSON": new access_path_1.ImportAccessPath("JSON"),
    "console": new access_path_1.ImportAccessPath("console"),
    "Symbol": new access_path_1.ImportAccessPath("Symbol"),
    "global": new access_path_1.ImportAccessPath("global"),
    "globalThis": new access_path_1.ImportAccessPath("global"),
    "Array": new access_path_1.ImportAccessPath("Array"),
    "Error": new access_path_1.ImportAccessPath("Error"),
    "System": new access_path_1.ImportAccessPath("System"),
    "Map": new access_path_1.ImportAccessPath("Map"),
    "Set": new access_path_1.ImportAccessPath("Set"),
    "RegExp": new access_path_1.ImportAccessPath("RegExp"),
    "Reflect": new access_path_1.ImportAccessPath("Reflect"),
    "Dict": new access_path_1.ImportAccessPath("Dict"),
    "Object": new access_path_1.ImportAccessPath("Object"),
    "Function": new access_path_1.ImportAccessPath("Function"),
    "Number": new access_path_1.ImportAccessPath("Number"),
    "String": new access_path_1.ImportAccessPath("String"),
    "navigator": new access_path_1.ImportAccessPath("navigator"),
    "window": new access_path_1.ImportAccessPath("global"),
    "Date": new access_path_1.ImportAccessPath("Date"),
    "FormData": new access_path_1.ImportAccessPath("FormData")
};
function isLeftHandSideInAssignment(path) {
    var currentPath = path;
    while (!(0, ast_utils_1.isProgram)(currentPath.parent.node) && !(0, ast_utils_1.isBlockStatement)(currentPath.parent.node) &&
        !((0, ast_utils_1.isMemberExpression)(currentPath.parent.node) && currentPath.parent.node.object === currentPath.node)) {
        if ((0, ast_utils_1.isAssignmentExpression)(currentPath.parent.node))
            return currentPath.parent.node.left === currentPath.node;
        currentPath = currentPath.parent;
    }
    return false;
}
function isCallee(path) {
    if ((0, ast_utils_1.isParenthesizedExpression)(path.parent.node))
        return isCallee(path.parent);
    return (0, ast_utils_1.isCallExpression)(path.parent.node) && path.parent.node.callee === path.node;
}
function pushTapirResultIfMaybeTrue(path, n, fileName, res, match1, match2, filterUncertainties) {
    if (!match1 && !match2)
        return;
    var matchResult = { node: n, fileName: fileName, accpath: path };
    if (match1 instanceof tapir_interactive_1.UncertainAccPathMatch || match2 instanceof tapir_interactive_1.UncertainAccPathMatch)
        matchResult.uncertainAccPath = true;
    if (filterUncertainties && filterUncertainties.length > 0)
        matchResult.uncertainCallFilters = filterUncertainties;
    res.push(matchResult);
}
