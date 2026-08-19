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
exports.setUnion = exports.addToMapSet = exports.addMapToMapArray = void 0;
function addMapToMapArray(target, source) {
    source.forEach(function (value, key) {
        if (!target.has(key)) {
            target.set(key, []);
        }
        value.forEach(function (v) { return target.get(key).push(v); });
    });
}
exports.addMapToMapArray = addMapToMapArray;
function addToMapSet(target, key, value) {
    if (!target.has(key))
        target.set(key, new Set());
    target.get(key).add(value);
}
exports.addToMapSet = addToMapSet;
// note: inefficient
function setUnion(sets) {
    return sets.reduce(function (combined, list) {
        return new Set(__spreadArray(__spreadArray([], __read(combined), false), __read(list), false));
    }, new Set());
}
exports.setUnion = setUnion;
