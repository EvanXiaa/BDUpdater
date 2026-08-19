"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobMatch = exports.globMatch = exports.parseGlobPattern = exports.GlobEnd = exports.GlobConstant = exports.GlobDisjunction = exports.Star = exports.GlobStar = void 0;
var GlobStar = /** @class */ (function () {
    function GlobStar(pattern) {
        this.pattern = pattern;
    }
    GlobStar.prototype.matches = function (path, wildcardNum) {
        if (!path.startsWith("/"))
            return [];
        var results = [];
        var currentPath = path;
        var slashIndex;
        var stringMatched = "";
        while ((slashIndex = currentPath.indexOf("/")) !== -1) {
            var restPath = currentPath.substring(slashIndex + 1);
            stringMatched += currentPath.substring(0, slashIndex + 1);
            this.pattern.matches(restPath, wildcardNum + 1).forEach(function (m) {
                var wildcardMatches = m.getWildcardMatches();
                wildcardMatches["#" + wildcardNum] = stringMatched;
                results.push(new GlobMatch(stringMatched + m.stringMatched, wildcardMatches));
            });
            currentPath = restPath;
        }
        return results;
    };
    GlobStar.prototype.toString = function () {
        return "/**/".concat(this.pattern);
    };
    return GlobStar;
}());
exports.GlobStar = GlobStar;
var Star = /** @class */ (function () {
    function Star(pattern) {
        this.pattern = pattern;
    }
    Star.prototype.matches = function (path, wildcardNum) {
        var results = [];
        var potentialMatchLength = path.indexOf("/") !== -1 ? path.indexOf("/") : path.length;
        var _loop_1 = function (i) {
            var matches = this_1.pattern.matches(path.substring(i), wildcardNum + 1);
            matches.forEach(function (m) {
                var wildcardMatches = m.getWildcardMatches();
                wildcardMatches["#" + wildcardNum] = path.substring(0, i);
                results.push(new GlobMatch(path.substring(0, i) + m.stringMatched, wildcardMatches));
            });
        };
        var this_1 = this;
        for (var i = 0; i <= potentialMatchLength; i++) {
            _loop_1(i);
        }
        return results;
    };
    Star.prototype.toString = function () {
        return "*".concat(this.pattern);
    };
    return Star;
}());
exports.Star = Star;
var GlobDisjunction = /** @class */ (function () {
    function GlobDisjunction(patterns, rest) {
        this.patterns = patterns;
        this.rest = rest;
    }
    GlobDisjunction.prototype.matches = function (path, wildcardNum) {
        var results = [];
        var globResults = this.patterns.map(function (p) { return p.matches(path, -1); }).reduce(function (acc, val) { return acc.concat(val); }, []);
        var _loop_2 = function (i) {
            var globResult = globResults[i];
            var restPath = path.substring(globResult.stringMatched.length);
            var matches = this_2.rest.matches(restPath, wildcardNum + 1);
            matches.forEach(function (m) {
                var wildcardMatches = m.getWildcardMatches();
                wildcardMatches["#" + wildcardNum] = globResult.stringMatched;
                results.push(new GlobMatch(globResult.stringMatched + m.stringMatched, wildcardMatches));
            });
        };
        var this_2 = this;
        for (var i = 0; i < globResults.length; i++) {
            _loop_2(i);
        }
        return results;
    };
    GlobDisjunction.prototype.toString = function () {
        return "{".concat(this.patterns.join(","), "}").concat(this.rest);
    };
    return GlobDisjunction;
}());
exports.GlobDisjunction = GlobDisjunction;
var GlobConstant = /** @class */ (function () {
    function GlobConstant(constant, globPattern) {
        this.constant = constant;
        this.globPattern = globPattern;
    }
    GlobConstant.prototype.matches = function (path, wildcardNum) {
        var _this = this;
        if (!path.startsWith(this.constant))
            return [];
        var globResults = this.globPattern.matches(path.substring(this.constant.length), wildcardNum);
        return globResults.map(function (globResult) { return new GlobMatch(_this.constant + globResult.stringMatched, globResult.getWildcardMatches()); });
    };
    GlobConstant.prototype.toString = function () {
        return "".concat(this.constant).concat(this.globPattern);
    };
    return GlobConstant;
}());
exports.GlobConstant = GlobConstant;
var GlobEnd = /** @class */ (function () {
    function GlobEnd() {
    }
    GlobEnd.prototype.matches = function (path, wildcardNum) {
        if (wildcardNum !== -1 && path !== "")
            return [];
        else
            return [new GlobMatch("", {})];
    };
    GlobEnd.prototype.toString = function () {
        return "";
    };
    return GlobEnd;
}());
exports.GlobEnd = GlobEnd;
function parseGlobPattern(pattern) {
    if (pattern.length === 0)
        return new GlobEnd();
    var nextSpecialCharacter = getNextSpecialCharacter(pattern);
    if (!nextSpecialCharacter)
        return new GlobConstant(pattern, new GlobEnd());
    var specialCharacterIndex = pattern.indexOf(nextSpecialCharacter);
    var specialCharacterPattern;
    if (nextSpecialCharacter === GLOB_STAR) {
        var restPattern = parseGlobPattern(pattern.substring(specialCharacterIndex + GLOB_STAR.length));
        specialCharacterPattern = new GlobStar(restPattern);
    }
    else if (nextSpecialCharacter === STAR) {
        var restPattern = parseGlobPattern(pattern.substring(specialCharacterIndex + STAR.length));
        specialCharacterPattern = new Star(restPattern);
    }
    else {
        var disjunctionPatterns = pattern.substring(specialCharacterIndex + STAR.length, pattern.indexOf("}"))
            .split(",").map(function (str) { return parseGlobPattern(str.trim()); });
        var restPattern = parseGlobPattern(pattern.substring(pattern.indexOf("}") + 1));
        specialCharacterPattern = new GlobDisjunction(disjunctionPatterns, restPattern);
    }
    var startsWithSpecialCharacter = pattern.indexOf(nextSpecialCharacter) === 0;
    return startsWithSpecialCharacter ? specialCharacterPattern : new GlobConstant(pattern.substring(0, specialCharacterIndex), specialCharacterPattern);
}
exports.parseGlobPattern = parseGlobPattern;
function globMatch(path, globPattern) {
    return globPattern.matches(path, 1).length > 0;
}
exports.globMatch = globMatch;
var GLOB_STAR = "/**/";
var STAR = "*";
var CURLY = "{";
function getNextSpecialCharacter(pattern) {
    var globStarIndex = pattern.indexOf(GLOB_STAR);
    var starIndex = pattern.indexOf(STAR);
    var curlyIndex = pattern.indexOf(CURLY);
    if (globStarIndex !== -1 && starIndex !== -1 && curlyIndex !== -1) {
        if (globStarIndex < starIndex && globStarIndex < curlyIndex)
            return GLOB_STAR;
        return starIndex < curlyIndex ? STAR : CURLY;
    }
    if (globStarIndex !== -1 && starIndex !== -1)
        return globStarIndex < starIndex ? GLOB_STAR : STAR;
    if (globStarIndex !== -1 && curlyIndex !== -1)
        return globStarIndex < curlyIndex ? GLOB_STAR : CURLY;
    if (starIndex !== -1 && curlyIndex !== -1)
        return starIndex < curlyIndex ? STAR : CURLY;
    if (globStarIndex !== -1)
        return GLOB_STAR;
    if (starIndex !== -1)
        return STAR;
    if (curlyIndex !== -1)
        return CURLY;
    return undefined;
}
var GlobMatch = /** @class */ (function () {
    function GlobMatch(stringMatched, wildcardMatches) {
        this.stringMatched = stringMatched;
        this.wildcardMatches = wildcardMatches;
    }
    GlobMatch.prototype.getWildcardMatches = function () {
        return Object.assign({}, this.wildcardMatches);
    };
    return GlobMatch;
}());
exports.GlobMatch = GlobMatch;
