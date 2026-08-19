export interface AccessPath {
    toString: () => string;
}
export declare class UnknownAccessPath implements AccessPath {
    toString(): string;
}
export declare const unknownAccessPathInstance: UnknownAccessPath;
export declare class ImportAccessPath implements AccessPath {
    readonly importPath: string;
    constructor(importPath: string);
    toString(): string;
}
export declare class PropAccessPath implements AccessPath {
    readonly receiver: AccessPath;
    readonly prop: string;
    constructor(receiver: AccessPath, prop: string);
    toString(): string;
}
export declare class CallAccessPath implements AccessPath {
    readonly callee: AccessPath;
    constructor(callee: AccessPath);
    toString(): string;
}
export declare class ThisAccessPath implements AccessPath {
    constructor();
    toString(): string;
}
export declare function parseAccessPath(accPath: string): AccessPath;
