import { Node } from 'estree';
import { GlobPattern } from "./glob";
import { MatchResult } from "../interactive/tapir-interactive";
import { AccessPath, ImportAccessPath } from "./access-path";
export interface PatternWrapper {
    pattern: string;
    question?: string;
    id: string;
    changelogId: string;
    changelogDescription: string;
    deprecation?: boolean;
    benign?: boolean;
}
export interface Pattern {
}
export declare class ImportPattern implements Pattern {
    readonly importPathPattern: ImportPathPattern;
    readonly onlyDefault: boolean;
    constructor(importPathPattern: ImportPathPattern, onlyDefault: boolean);
    toString(): string;
}
export declare class ReadPropertyPattern implements Pattern {
    readonly propertyPathPattern: PropertyPathPattern;
    readonly notInvoked: boolean;
    constructor(propertyPathPattern: PropertyPathPattern, notInvoked: boolean);
    toString(): string;
}
export declare class WritePropertyPattern implements Pattern {
    readonly propertyPathPattern: PropertyPathPattern;
    constructor(propertyPathPattern: PropertyPathPattern);
    toString(): string;
}
export declare class CallPattern implements Pattern {
    readonly accessPathPattern: AccessPathPattern;
    readonly filters: Filter[];
    readonly onlyReturnChanged: boolean;
    constructor(accessPathPattern: AccessPathPattern, filters: Filter[], onlyReturnChanged: boolean);
    toString(): string;
}
export declare class PropertyPathPattern implements AccessPathPattern {
    readonly receiver: AccessPathPattern;
    readonly propNames: string[];
    constructor(receiver: AccessPathPattern, propNames: string[]);
    toString(): string;
    matches(accPath: AccessPath, unknownRequires: Set<ImportAccessPath>): MatchResult;
}
export interface AccessPathPattern {
    matches: (accPath: AccessPath, unknownRequires: Set<ImportAccessPath>) => MatchResult;
}
export declare class ImportPathPattern implements AccessPathPattern {
    readonly importPathPattern: GlobPattern;
    constructor(importPathPattern: string);
    toString(ignoreAngleBrackets?: boolean): string;
    matches(accPath: AccessPath, unknownRequires: Set<ImportAccessPath>): MatchResult;
}
export declare class DisjunctionAccessPathPattern implements AccessPathPattern {
    readonly accessPathPatterns: AccessPathPattern[];
    constructor(accessPathPatterns: AccessPathPattern[]);
    toString(): string;
    matches(accPath: AccessPath, unknownRequires: Set<ImportAccessPath>): MatchResult;
}
export declare class ExclusionAccessPathPattern implements AccessPathPattern {
    readonly includeAccPathPattern: AccessPathPattern;
    readonly excludeAccPathPattern: AccessPathPattern;
    constructor(includeAccPathPattern: AccessPathPattern, excludeAccPathPattern: AccessPathPattern);
    toString(): string;
    matches(accPath: AccessPath, unknownRequires: Set<ImportAccessPath>): MatchResult;
}
export declare class CallAccessPathPattern implements AccessPathPattern {
    readonly accessPathPattern: AccessPathPattern;
    constructor(accessPathPattern: AccessPathPattern);
    toString(): string;
    matches(accPath: AccessPath, unknownRequires: Set<ImportAccessPath>): MatchResult;
}
export declare class WildcardAccessPathPattern implements AccessPathPattern {
    readonly accessPathPattern: AccessPathPattern;
    constructor(accessPathPattern: AccessPathPattern);
    toString(): string;
    matches(accPath: AccessPath, unknownRequires: Set<ImportAccessPath>): MatchResult;
}
export declare class PotentiallyUnknownAccessPathPattern implements AccessPathPattern {
    readonly accessPathPattern: AccessPathPattern;
    constructor(accessPathPattern: AccessPathPattern);
    toString(): string;
    matches(accPath: AccessPath, unknownRequires: Set<ImportAccessPath>): MatchResult;
}
export interface Filter {
    matches: (args: Node[]) => MatchResult;
}
export declare class NumArgsFilter implements Filter {
    readonly minArgs: number;
    readonly maxArgs: number;
    constructor(minArgs: number, maxArgs: number);
    toString(): string;
    matches(args: Node[]): MatchResult;
    getMinArgs(): number;
    getMaxArgs(): number;
}
export declare class ArgTypeFilter implements Filter {
    readonly argNumber: number;
    readonly argTypes: JSType[];
    constructor(argNumber: number, argTypes: JSType[]);
    toString(): string;
    matches(args: Node[]): MatchResult;
}
export declare function parsePattern(pattern: string): Pattern;
export declare function parseAccessPathPattern(path: string): AccessPathPattern;
export declare function parseFilters(pattern: string): Filter[];
export type JSType = 'string' | 'number' | 'boolean' | 'undefined' | 'function' | 'function1' | 'function2' | 'function3' | 'object' | 'array' | string;
export declare const JSTypes: string[];
