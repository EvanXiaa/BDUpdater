"use strict";
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
exports.JSTypes = exports.parseFilters = exports.parseAccessPathPattern = exports.parsePattern = exports.ArgTypeFilter = exports.NumArgsFilter = exports.PotentiallyUnknownAccessPathPattern = exports.WildcardAccessPathPattern = exports.CallAccessPathPattern = exports.ExclusionAccessPathPattern = exports.DisjunctionAccessPathPattern = exports.ImportPathPattern = exports.PropertyPathPattern = exports.CallPattern = exports.WritePropertyPattern = exports.ReadPropertyPattern = exports.ImportPattern = void 0;
var ast_utils_1 = require("../util/ast-utils");
var glob_1 = require("./glob");
var tapir_interactive_1 = require("../interactive/tapir-interactive");
var access_path_1 = require("./access-path");
var ImportPattern = /** @class */ (function () {
    function ImportPattern(importPathPattern, onlyDefault) {
        this.importPathPattern = importPathPattern;
        this.onlyDefault = onlyDefault;
    }
    ImportPattern.prototype.toString = function () {
        return "import".concat(this.onlyDefault ? "D" : "", " ").concat(this.importPathPattern.toString(true));
    };
    return ImportPattern;
}());
exports.ImportPattern = ImportPattern;
var ReadPropertyPattern = /** @class */ (function () {
    function ReadPropertyPattern(propertyPathPattern, notInvoked) {
        this.propertyPathPattern = propertyPathPattern;
        this.notInvoked = notInvoked;
    }
    ReadPropertyPattern.prototype.toString = function () {
        return "read".concat(this.notInvoked ? "O" : "", " ").concat(this.propertyPathPattern);
    };
    return ReadPropertyPattern;
}());
exports.ReadPropertyPattern = ReadPropertyPattern;
var WritePropertyPattern = /** @class */ (function () {
    function WritePropertyPattern(propertyPathPattern) {
        this.propertyPathPattern = propertyPathPattern;
    }
    WritePropertyPattern.prototype.toString = function () {
        return "write ".concat(this.propertyPathPattern);
    };
    return WritePropertyPattern;
}());
exports.WritePropertyPattern = WritePropertyPattern;
var CallPattern = /** @class */ (function () {
    function CallPattern(accessPathPattern, filters, onlyReturnChanged) {
        this.accessPathPattern = accessPathPattern;
        this.filters = filters;
        this.onlyReturnChanged = onlyReturnChanged;
    }
    CallPattern.prototype.toString = function () {
        return "call".concat(this.onlyReturnChanged ? "R" : "", " ").concat(__spreadArray([this.accessPathPattern], __read(this.filters), false).join(" "));
    };
    return CallPattern;
}());
exports.CallPattern = CallPattern;
var PropertyPathPattern = /** @class */ (function () {
    function PropertyPathPattern(receiver, propNames) {
        this.receiver = receiver;
        this.propNames = propNames;
    }
    PropertyPathPattern.prototype.toString = function () {
        return this.propNames.length === 1 ?
            "".concat(this.receiver, ".").concat(this.propNames[0]) :
            "".concat(this.receiver, ".{").concat(this.propNames.join(","), "}");
    };
    PropertyPathPattern.prototype.matches = function (accPath, unknownRequires) {
        if (accPath instanceof access_path_1.PropAccessPath && this.propNames.includes(accPath.prop))
            return this.receiver.matches(accPath.receiver, unknownRequires);
        return tapir_interactive_1.FALSE_RESULT_INSTANCE;
    };
    return PropertyPathPattern;
}());
exports.PropertyPathPattern = PropertyPathPattern;
var ImportPathPattern = /** @class */ (function () {
    function ImportPathPattern(importPathPattern) {
        this.importPathPattern = (0, glob_1.parseGlobPattern)(importPathPattern);
    }
    ImportPathPattern.prototype.toString = function (ignoreAngleBrackets) {
        if (ignoreAngleBrackets)
            return "".concat(this.importPathPattern);
        return "<".concat(this.importPathPattern, ">");
    };
    ImportPathPattern.prototype.matches = function (accPath, unknownRequires) {
        var _this = this;
        if (accPath instanceof access_path_1.ImportAccessPath) {
            var importString = accPath.importPath.endsWith(".js") ? accPath.importPath.substring(0, accPath.importPath.length - 3) : accPath.importPath;
            return (0, glob_1.globMatch)(importString, this.importPathPattern) ? tapir_interactive_1.TRUE_RESULT_INSTANCE : tapir_interactive_1.FALSE_RESULT_INSTANCE;
        }
        else if (accPath instanceof access_path_1.UnknownAccessPath && __spreadArray([], __read(unknownRequires), false).some(function (ukr) { return (0, glob_1.globMatch)(ukr.importPath, _this.importPathPattern); }))
            return new tapir_interactive_1.MaybeImportPathMatch(this.importPathPattern);
        return tapir_interactive_1.FALSE_RESULT_INSTANCE;
    };
    return ImportPathPattern;
}());
exports.ImportPathPattern = ImportPathPattern;
var DisjunctionAccessPathPattern = /** @class */ (function () {
    function DisjunctionAccessPathPattern(accessPathPatterns) {
        this.accessPathPatterns = accessPathPatterns;
    }
    DisjunctionAccessPathPattern.prototype.toString = function () {
        return "{".concat(this.accessPathPatterns.map(function (accPath) { return accPath.toString(); }).join(","), "}");
    };
    DisjunctionAccessPathPattern.prototype.matches = function (accPath, unknownRequires) {
        return tapir_interactive_1.orMatchResult.apply(void 0, __spreadArray([], __read(this.accessPathPatterns.map(function (accPathPattern) { return accPathPattern.matches(accPath, unknownRequires); })), false));
    };
    return DisjunctionAccessPathPattern;
}());
exports.DisjunctionAccessPathPattern = DisjunctionAccessPathPattern;
var ExclusionAccessPathPattern = /** @class */ (function () {
    function ExclusionAccessPathPattern(includeAccPathPattern, excludeAccPathPattern) {
        this.includeAccPathPattern = includeAccPathPattern;
        this.excludeAccPathPattern = excludeAccPathPattern;
    }
    ExclusionAccessPathPattern.prototype.toString = function () {
        return "(".concat(this.includeAccPathPattern, "\\").concat(this.excludeAccPathPattern, ")");
    };
    ExclusionAccessPathPattern.prototype.matches = function (accPath, unknownRequires) {
        return (0, tapir_interactive_1.andMatchResult)(this.includeAccPathPattern.matches(accPath, unknownRequires), this.excludeAccPathPattern.matches(accPath, unknownRequires).negate());
    };
    return ExclusionAccessPathPattern;
}());
exports.ExclusionAccessPathPattern = ExclusionAccessPathPattern;
var CallAccessPathPattern = /** @class */ (function () {
    function CallAccessPathPattern(accessPathPattern) {
        this.accessPathPattern = accessPathPattern;
    }
    CallAccessPathPattern.prototype.toString = function () {
        return "".concat(this.accessPathPattern, "()");
    };
    CallAccessPathPattern.prototype.matches = function (accPath, unknownRequires) {
        if (accPath instanceof access_path_1.CallAccessPath)
            return this.accessPathPattern.matches(accPath.callee, unknownRequires);
        return tapir_interactive_1.FALSE_RESULT_INSTANCE;
    };
    return CallAccessPathPattern;
}());
exports.CallAccessPathPattern = CallAccessPathPattern;
var WildcardAccessPathPattern = /** @class */ (function () {
    function WildcardAccessPathPattern(accessPathPattern) {
        this.accessPathPattern = accessPathPattern;
    }
    WildcardAccessPathPattern.prototype.toString = function () {
        return "".concat(this.accessPathPattern, "**");
    };
    WildcardAccessPathPattern.prototype.matches = function (accPath, unknownRequires) {
        var nextElementResult = tapir_interactive_1.FALSE_RESULT_INSTANCE;
        if (accPath instanceof access_path_1.PropAccessPath)
            nextElementResult = this.matches(accPath.receiver, unknownRequires);
        else if (accPath instanceof access_path_1.CallAccessPath)
            nextElementResult = this.matches(accPath.callee, unknownRequires);
        return (0, tapir_interactive_1.orMatchResult)(this.accessPathPattern.matches(accPath, unknownRequires), nextElementResult);
    };
    return WildcardAccessPathPattern;
}());
exports.WildcardAccessPathPattern = WildcardAccessPathPattern;
var PotentiallyUnknownAccessPathPattern = /** @class */ (function () {
    function PotentiallyUnknownAccessPathPattern(accessPathPattern) {
        this.accessPathPattern = accessPathPattern;
    }
    PotentiallyUnknownAccessPathPattern.prototype.toString = function () {
        return "".concat(this.accessPathPattern, "?");
    };
    PotentiallyUnknownAccessPathPattern.prototype.matches = function (accPath, unknownRequires) {
        if (accPath instanceof access_path_1.UnknownAccessPath || accPath instanceof access_path_1.ThisAccessPath)
            return new tapir_interactive_1.MaybeAccPathMatch(this.accessPathPattern);
        return this.accessPathPattern.matches(accPath, unknownRequires);
    };
    return PotentiallyUnknownAccessPathPattern;
}());
exports.PotentiallyUnknownAccessPathPattern = PotentiallyUnknownAccessPathPattern;
var NumArgsFilter = /** @class */ (function () {
    function NumArgsFilter(minArgs, maxArgs) {
        this.minArgs = minArgs;
        this.maxArgs = maxArgs;
    }
    NumArgsFilter.prototype.toString = function () {
        return "[".concat(this.minArgs, ", ").concat(this.maxArgs, "]");
    };
    NumArgsFilter.prototype.matches = function (args) {
        return (0, tapir_interactive_1.getMatchResultFromBoolean)(args.length >= this.minArgs && args.length <= this.maxArgs);
    };
    NumArgsFilter.prototype.getMinArgs = function () {
        return this.minArgs;
    };
    NumArgsFilter.prototype.getMaxArgs = function () {
        return this.maxArgs;
    };
    return NumArgsFilter;
}());
exports.NumArgsFilter = NumArgsFilter;
var ArgTypeFilter = /** @class */ (function () {
    function ArgTypeFilter(argNumber, argTypes) {
        this.argNumber = argNumber;
        this.argTypes = argTypes;
    }
    ArgTypeFilter.prototype.toString = function () {
        return this.argTypes.length === 1 ?
            "".concat(this.argNumber, ":").concat(this.argTypes[0]) :
            "".concat(this.argNumber, ":{").concat(this.argTypes.join(","), "}");
    };
    ArgTypeFilter.prototype.matches = function (args) {
        var argument = args[this.argNumber];
        function getValueFromLiteral(jstype) {
            if ((jstype.startsWith("'") && jstype.endsWith("'")) || (jstype.startsWith("\"") && jstype.endsWith("\"")))
                return jstype.substring(1, jstype.length - 1);
            else if (jstype === "NaN")
                return NaN;
            else if (jstype === "undefined")
                return undefined;
            else if (jstype === "false")
                return false;
            else if (jstype === "true")
                return true;
            var numberRes = parseInt(jstype);
            if (isNaN(numberRes))
                throw new Error("Invalid type in type filter: ".concat(jstype));
            return numberRes;
        }
        return tapir_interactive_1.orMatchResult.apply(void 0, __spreadArray([], __read(this.argTypes.map(function (jstype) {
            if ((0, ast_utils_1.isSimpleLiteral)(argument)) {
                if (exports.JSTypes.includes(jstype)) {
                    return (0, tapir_interactive_1.getMatchResultFromBoolean)(typeof argument.value === jstype);
                }
                else {
                    return (0, tapir_interactive_1.getMatchResultFromBoolean)(argument.value === getValueFromLiteral(jstype));
                }
            }
            if ((0, ast_utils_1.isFunctionExpression)(argument) || (0, ast_utils_1.isArrowFunctionExpression)(argument)) {
                if (jstype === 'function')
                    return tapir_interactive_1.TRUE_RESULT_INSTANCE;
                for (var i = 1; i <= 3; i++)
                    if (jstype === 'function' + i)
                        return (0, tapir_interactive_1.getMatchResultFromBoolean)(argument.params.length === i);
                return tapir_interactive_1.FALSE_RESULT_INSTANCE;
            }
            if ((0, ast_utils_1.isObjectExpression)(argument)) {
                return (0, tapir_interactive_1.getMatchResultFromBoolean)(jstype === 'object');
            }
            if ((0, ast_utils_1.isArrayExpression)(argument)) {
                return (0, tapir_interactive_1.getMatchResultFromBoolean)(jstype === 'array');
            }
            if ((0, ast_utils_1.isTemplateLiteral)(argument)) {
                return (0, tapir_interactive_1.getMatchResultFromBoolean)(jstype === 'string');
            }
            if ((0, ast_utils_1.isNegationExpression)(argument)) {
                return (0, tapir_interactive_1.getMatchResultFromBoolean)(jstype === 'boolean');
            }
            return new tapir_interactive_1.MaybeArgTypeMatch(argument, jstype);
        })), false));
    };
    return ArgTypeFilter;
}());
exports.ArgTypeFilter = ArgTypeFilter;
function parsePattern(pattern) {
    var _a = __read(pattern.split(" "), 2), kind = _a[0], path = _a[1];
    if (kind === "import") {
        return new ImportPattern(new ImportPathPattern(path), false);
    }
    else if (kind === "importD") {
        return new ImportPattern(new ImportPathPattern(path), true);
    }
    else if (kind.startsWith("read")) {
        var propertyPathPattern = parsePropertyPathPattern(path);
        return new ReadPropertyPattern(propertyPathPattern, kind === "readO");
    }
    else if (kind === "write") {
        var propertyPathPattern = parsePropertyPathPattern(path);
        return new WritePropertyPattern(propertyPathPattern);
    }
    else if (kind.startsWith("call")) {
        var accessPathPattern = parseAccessPathPattern(path);
        var filters = parseFilters(pattern);
        return new CallPattern(accessPathPattern, filters, kind === "callR");
    }
    throw new Error("Invalid pattern kind. Expected import, read, write or call, but got: ".concat(kind));
}
exports.parsePattern = parsePattern;
function parsePropertyPathPattern(path) {
    var indexLastDot = path.lastIndexOf(".");
    if (indexLastDot === -1 || indexLastDot === path.length - 1 || indexLastDot === 0) {
        throw new Error("Not a valid property path pattern: ".concat(path));
    }
    var receiverAccessPath = parseAccessPathPattern(path.substring(0, indexLastDot));
    var propertyString = path.substring(indexLastDot + 1);
    var propNames = propertyString.startsWith("{") && propertyString.endsWith("}") ?
        propertyString.substring(1, propertyString.length - 1).split(",").map(function (str) { return str.trim(); }) :
        [propertyString];
    return new PropertyPathPattern(receiverAccessPath, propNames);
}
function parseAccessPathPattern(path) {
    if (path.startsWith("<") && path.endsWith(">"))
        return new ImportPathPattern(path.substring(1, path.length - 1));
    if (path.startsWith("{") && isDisjunctionAccessPathPattern(path))
        return new DisjunctionAccessPathPattern(splitConnectiveString(path.substring(1, path.length - 1), ',', '{', '}').map(function (str) { return str.trim(); }).map(parseAccessPathPattern));
    if (path.startsWith("(") && isExclusionAccessPathPattern(path)) {
        var _a = __read(splitConnectiveString(path.substring(1, path.length - 1), '\\', '(', ')').map(function (str) { return str.trim(); }).map(parseAccessPathPattern), 2), includeAccPathPattern = _a[0], excludeAccPathPattern = _a[1];
        return new ExclusionAccessPathPattern(includeAccPathPattern, excludeAccPathPattern);
    }
    if (path.endsWith("()"))
        return new CallAccessPathPattern(parseAccessPathPattern(path.substring(0, path.length - 2)));
    if (path.endsWith("**"))
        return new WildcardAccessPathPattern(parseAccessPathPattern(path.substring(0, path.length - 2)));
    if (path.endsWith("?"))
        return new PotentiallyUnknownAccessPathPattern(parseAccessPathPattern(path.substring(0, path.length - 1)));
    try {
        return parsePropertyPathPattern(path);
    }
    catch (e) {
        throw new Error("Not a valid AccessPathPattern string: ".concat(path));
    }
}
exports.parseAccessPathPattern = parseAccessPathPattern;
function isConnectiveAccessPath(path, splitOperator, useCurly) {
    var startSymbol = useCurly ? '{' : '(';
    var endSymbol = useCurly ? '}' : ')';
    if (!path.startsWith(startSymbol) || !path.endsWith(endSymbol))
        return false;
    var hasSeenSplitter = false;
    var parenLevel = 1;
    for (var i = 1; i < path.length - 1; i++) {
        if (path.charAt(i) === startSymbol)
            parenLevel++;
        else if (path.charAt(i) === splitOperator && parenLevel === 1)
            hasSeenSplitter = true;
        else if (path.charAt(i) === endSymbol)
            parenLevel--;
        if (parenLevel === 0)
            return false;
    }
    return hasSeenSplitter;
}
function isDisjunctionAccessPathPattern(path) {
    return isConnectiveAccessPath(path, ',', true);
}
function isExclusionAccessPathPattern(path) {
    return isConnectiveAccessPath(path, '\\', false);
}
function splitConnectiveString(path, connectiveOperator, startSymbol, endSymbol) {
    var res = [];
    var parenLevel = 0;
    var nextSplitStart = 0;
    for (var i = 0; i < path.length; i++) {
        if (path.charAt(i) === startSymbol)
            parenLevel++;
        else if (path.charAt(i) === endSymbol)
            parenLevel--;
        if (parenLevel === 0 && path.charAt(i) === connectiveOperator) {
            res.push(path.substring(nextSplitStart, i));
            nextSplitStart = i + 1;
        }
    }
    res.push(path.substring(nextSplitStart, path.length));
    return res;
}
function parseFilters(pattern) {
    return splitConnectiveString(pattern.split(" ").splice(2).join(" "), " ", "[", "]").map(function (filterString) { return filterString.trim(); }).filter(function (str) { return str; }).map(parseFilter);
}
exports.parseFilters = parseFilters;
function parseFilter(filterString) {
    var numArgsMatch = filterString.match("\\[\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\]");
    if (numArgsMatch) {
        return new NumArgsFilter(parseInt(numArgsMatch[1]), parseInt(numArgsMatch[2]));
    }
    var multipleTypesMatch = filterString.match("(\\d+)\\s*:\\s*\\{(.*)\\}");
    if (multipleTypesMatch) {
        var _a = __read(multipleTypesMatch, 3), argNum = _a[1], typesString = _a[2];
        return new ArgTypeFilter(parseInt(argNum), typesString.split(",").map(function (str) { return str.trim(); }));
    }
    var singleTypeMatch = filterString.match("(\\d+)\\s*:\\s*(.*)");
    if (singleTypeMatch) {
        var _b = __read(singleTypeMatch, 3), argNum = _b[1], typesString = _b[2];
        return new ArgTypeFilter(parseInt(argNum), [typesString.trim()]);
    }
    throw new Error("Invalid filter: ".concat(filterString));
}
exports.JSTypes = ['string', 'number', 'boolean', 'undefined', 'function', 'function1', 'function2', 'function3', 'object', 'array'];
