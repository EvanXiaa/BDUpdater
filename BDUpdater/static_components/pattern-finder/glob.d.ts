export interface GlobPattern {
    matches(path: string, wildcardNum: number): GlobMatch[];
    toString(): string;
}
export declare class GlobStar implements GlobPattern {
    readonly pattern: GlobPattern;
    constructor(pattern: GlobPattern);
    matches(path: string, wildcardNum: number): GlobMatch[];
    toString(): string;
}
export declare class Star implements GlobPattern {
    readonly pattern: GlobPattern;
    constructor(pattern: GlobPattern);
    matches(path: string, wildcardNum: number): GlobMatch[];
    toString(): string;
}
export declare class GlobDisjunction implements GlobPattern {
    readonly patterns: GlobPattern[];
    readonly rest: GlobPattern;
    constructor(patterns: GlobPattern[], rest: GlobPattern);
    matches(path: string, wildcardNum: number): GlobMatch[];
    toString(): string;
}
export declare class GlobConstant implements GlobPattern {
    readonly constant: string;
    readonly globPattern: GlobPattern;
    constructor(constant: string, globPattern: GlobPattern);
    matches(path: string, wildcardNum: number): GlobMatch[];
    toString(): string;
}
export declare class GlobEnd implements GlobPattern {
    matches(path: string, wildcardNum: number): GlobMatch[];
    toString(): string;
}
export declare function parseGlobPattern(pattern: string): GlobPattern;
export declare function globMatch(path: string, globPattern: GlobPattern): boolean;
export declare class GlobMatch {
    readonly stringMatched: string;
    private wildcardMatches;
    constructor(stringMatched: string, wildcardMatches: any);
    getWildcardMatches(): any;
}
