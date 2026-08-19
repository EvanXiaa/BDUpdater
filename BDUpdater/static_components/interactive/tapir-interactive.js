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
exports.getMatchResultFromBoolean = exports.andMatchResult = exports.orMatchResult = exports.DisjunctionMatchResult = exports.MaybeApplyOrSpreadArgFilterMatch = exports.MaybeImportPathMatch = exports.MaybeArgTypeMatch = exports.UncertainAccPathMatch = exports.UncertainMatchDueToMultipleAccPaths = exports.MaybeAccPathMatch = exports.FALSE_RESULT_INSTANCE = exports.TRUE_RESULT_INSTANCE = exports.TrueResult = void 0;
var TrueResult = /** @class */ (function () {
    function TrueResult() {
    }
    TrueResult.prototype.negate = function () {
        return exports.FALSE_RESULT_INSTANCE;
    };
    return TrueResult;
}());
exports.TrueResult = TrueResult;
exports.TRUE_RESULT_INSTANCE = new TrueResult();
var FalseResult = /** @class */ (function () {
    function FalseResult() {
    }
    FalseResult.prototype.negate = function () {
        return exports.TRUE_RESULT_INSTANCE;
    };
    return FalseResult;
}());
exports.FALSE_RESULT_INSTANCE = new FalseResult();
var MaybeAccPathMatch = /** @class */ (function () {
    function MaybeAccPathMatch(accPathMatchedByUnknown, negated) {
        this.accPathMatchedByUnknown = accPathMatchedByUnknown;
        this.negated = !!negated;
    }
    MaybeAccPathMatch.prototype.negate = function () {
        return new MaybeAccPathMatch(this.accPathMatchedByUnknown, !this.negated);
    };
    return MaybeAccPathMatch;
}());
exports.MaybeAccPathMatch = MaybeAccPathMatch;
var UncertainMatchDueToMultipleAccPaths = /** @class */ (function () {
    function UncertainMatchDueToMultipleAccPaths(negated) {
        this.negated = !!negated;
    }
    UncertainMatchDueToMultipleAccPaths.prototype.negate = function () {
        return new UncertainMatchDueToMultipleAccPaths(!this.negated);
    };
    return UncertainMatchDueToMultipleAccPaths;
}());
exports.UncertainMatchDueToMultipleAccPaths = UncertainMatchDueToMultipleAccPaths;
var UncertainAccPathMatch = /** @class */ (function () {
    function UncertainAccPathMatch(negated) {
        this.negated = !!negated;
    }
    UncertainAccPathMatch.prototype.negate = function () {
        return new UncertainMatchDueToMultipleAccPaths(!this.negated);
    };
    return UncertainAccPathMatch;
}());
exports.UncertainAccPathMatch = UncertainAccPathMatch;
var MaybeArgTypeMatch = /** @class */ (function () {
    function MaybeArgTypeMatch(argument, typesToMatch, negated) {
        this.argument = argument;
        this.typesToMatch = typesToMatch;
        this.negated = !!negated;
    }
    MaybeArgTypeMatch.prototype.negate = function () {
        return new MaybeArgTypeMatch(this.argument, this.typesToMatch, !this.negated);
    };
    return MaybeArgTypeMatch;
}());
exports.MaybeArgTypeMatch = MaybeArgTypeMatch;
var MaybeImportPathMatch = /** @class */ (function () {
    function MaybeImportPathMatch(importPathPattern, negated) {
        this.importPathPattern = importPathPattern;
        this.negated = !!negated;
    }
    MaybeImportPathMatch.prototype.negate = function () {
        return new MaybeImportPathMatch(this.importPathPattern, !this.negated);
    };
    return MaybeImportPathMatch;
}());
exports.MaybeImportPathMatch = MaybeImportPathMatch;
var MaybeApplyOrSpreadArgFilterMatch = /** @class */ (function () {
    function MaybeApplyOrSpreadArgFilterMatch(filters, negated) {
        this.filters = filters;
        this.negated = !!negated;
    }
    MaybeApplyOrSpreadArgFilterMatch.prototype.negate = function () {
        return new MaybeApplyOrSpreadArgFilterMatch(this.filters, !this.negated);
    };
    return MaybeApplyOrSpreadArgFilterMatch;
}());
exports.MaybeApplyOrSpreadArgFilterMatch = MaybeApplyOrSpreadArgFilterMatch;
var DisjunctionMatchResult = /** @class */ (function () {
    function DisjunctionMatchResult(matchResults) {
        this.matchResults = matchResults;
    }
    DisjunctionMatchResult.prototype.negate = function () {
        return new ConjunctionMatchResult(new Set(__spreadArray([], __read(this.matchResults), false).map(function (m) { return m.negate(); })));
    };
    return DisjunctionMatchResult;
}());
exports.DisjunctionMatchResult = DisjunctionMatchResult;
var ConjunctionMatchResult = /** @class */ (function () {
    function ConjunctionMatchResult(matchResults) {
        this.matchResults = matchResults;
    }
    ConjunctionMatchResult.prototype.negate = function () {
        return new DisjunctionMatchResult(new Set(__spreadArray([], __read(this.matchResults), false).map(function (m) { return m.negate(); })));
    };
    return ConjunctionMatchResult;
}());
function orMatchResult() {
    var matchResults = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        matchResults[_i] = arguments[_i];
    }
    if (matchResults.some(function (r) { return r === exports.TRUE_RESULT_INSTANCE; }))
        return exports.TRUE_RESULT_INSTANCE;
    if (!matchResults.some(function (r) { return r !== exports.FALSE_RESULT_INSTANCE; }))
        return exports.FALSE_RESULT_INSTANCE;
    var res = new Set();
    matchResults.filter(function (m) { return m !== exports.FALSE_RESULT_INSTANCE; }).forEach(function (m) { return (m instanceof DisjunctionMatchResult ? m.matchResults : new Set([m])).forEach(function (m) { return res.add(m); }); });
    return (res.size === 1) ? res.values().next().value : new DisjunctionMatchResult(res);
}
exports.orMatchResult = orMatchResult;
function andMatchResult() {
    var matchResults = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        matchResults[_i] = arguments[_i];
    }
    if (matchResults.some(function (r) { return r === exports.FALSE_RESULT_INSTANCE; }))
        return exports.FALSE_RESULT_INSTANCE;
    if (!matchResults.some(function (r) { return r !== exports.TRUE_RESULT_INSTANCE; }))
        return exports.TRUE_RESULT_INSTANCE;
    var res = new Set();
    matchResults.filter(function (m) { return m !== exports.TRUE_RESULT_INSTANCE; }).forEach(function (m) { return (m instanceof ConjunctionMatchResult ? m.matchResults : new Set([m])).forEach(function (m) { return res.add(m); }); });
    return (res.size === 1) ? res.values().next().value : new ConjunctionMatchResult(res);
}
exports.andMatchResult = andMatchResult;
function getMatchResultFromBoolean(res) {
    return res ? exports.TRUE_RESULT_INSTANCE : exports.FALSE_RESULT_INSTANCE;
}
exports.getMatchResultFromBoolean = getMatchResultFromBoolean;
