"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAccessPath = exports.ThisAccessPath = exports.CallAccessPath = exports.PropAccessPath = exports.ImportAccessPath = exports.unknownAccessPathInstance = exports.UnknownAccessPath = void 0;
var UnknownAccessPath = /** @class */ (function () {
    function UnknownAccessPath() {
    }
    UnknownAccessPath.prototype.toString = function () {
        return "U";
    };
    return UnknownAccessPath;
}());
exports.UnknownAccessPath = UnknownAccessPath;
exports.unknownAccessPathInstance = new UnknownAccessPath();
var ImportAccessPath = /** @class */ (function () {
    function ImportAccessPath(importPath) {
        this.importPath = importPath;
    }
    ImportAccessPath.prototype.toString = function () {
        return "<".concat(this.importPath, ">");
    };
    return ImportAccessPath;
}());
exports.ImportAccessPath = ImportAccessPath;
var PropAccessPath = /** @class */ (function () {
    function PropAccessPath(receiver, prop) {
        this.receiver = receiver;
        this.prop = prop;
    }
    PropAccessPath.prototype.toString = function () {
        return "".concat(this.receiver, ".").concat(this.prop);
    };
    return PropAccessPath;
}());
exports.PropAccessPath = PropAccessPath;
var CallAccessPath = /** @class */ (function () {
    function CallAccessPath(callee) {
        this.callee = callee;
    }
    CallAccessPath.prototype.toString = function () {
        return "".concat(this.callee, "()");
    };
    return CallAccessPath;
}());
exports.CallAccessPath = CallAccessPath;
var ThisAccessPath = /** @class */ (function () {
    function ThisAccessPath() {
    }
    ThisAccessPath.prototype.toString = function () {
        return "this";
    };
    return ThisAccessPath;
}());
exports.ThisAccessPath = ThisAccessPath;
function parseAccessPath(accPath) {
    if (accPath.endsWith("()"))
        return new CallAccessPath(parseAccessPath(accPath.substring(0, accPath.length - 2)));
    if (accPath.startsWith("<") && accPath.endsWith(">"))
        return new ImportAccessPath(accPath.substring(1, accPath.length - 1));
    if (accPath === "U")
        return exports.unknownAccessPathInstance;
    if (accPath.includes(".")) {
        var receiverAccPathString = accPath.substring(0, accPath.lastIndexOf("."));
        var propName = accPath.substring(accPath.lastIndexOf(".") + 1);
        return new PropAccessPath(parseAccessPath(receiverAccPathString), propName);
    }
    throw new Error("Invalid accPath: ".concat(accPath));
}
exports.parseAccessPath = parseAccessPath;
