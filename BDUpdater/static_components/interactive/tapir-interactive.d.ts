import { AccessPathPattern, Filter } from "../pattern-finder/pattern-language";
import { GlobPattern } from "../pattern-finder/glob";
import { Node } from "estree";
export interface MatchResult {
    negate: () => MatchResult;
}
export declare class TrueResult implements MatchResult {
    negate(): FalseResult;
}
export declare const TRUE_RESULT_INSTANCE: TrueResult;
declare class FalseResult implements MatchResult {
    negate(): TrueResult;
}
export declare const FALSE_RESULT_INSTANCE: FalseResult;
export declare class MaybeAccPathMatch implements MatchResult {
    readonly accPathMatchedByUnknown: AccessPathPattern;
    readonly negated: boolean;
    constructor(accPathMatchedByUnknown: AccessPathPattern, negated?: boolean);
    negate(): MaybeAccPathMatch;
}
export declare class UncertainMatchDueToMultipleAccPaths implements MatchResult {
    readonly negated: boolean;
    constructor(negated?: boolean);
    negate(): UncertainMatchDueToMultipleAccPaths;
}
export declare class UncertainAccPathMatch implements MatchResult {
    readonly negated: boolean;
    constructor(negated?: boolean);
    negate(): UncertainMatchDueToMultipleAccPaths;
}
export declare class MaybeArgTypeMatch implements MatchResult {
    readonly argument: Node;
    readonly typesToMatch: string;
    readonly negated: boolean;
    constructor(argument: Node, typesToMatch: string, negated?: boolean);
    negate(): MaybeArgTypeMatch;
}
export declare class MaybeImportPathMatch implements MatchResult {
    readonly importPathPattern: GlobPattern;
    readonly negated: boolean;
    constructor(importPathPattern: GlobPattern, negated?: boolean);
    negate(): MaybeImportPathMatch;
}
export declare class MaybeApplyOrSpreadArgFilterMatch implements MatchResult {
    readonly filters: Filter[];
    readonly negated: boolean;
    constructor(filters: Filter[], negated?: boolean);
    negate(): MaybeApplyOrSpreadArgFilterMatch;
}
export declare class DisjunctionMatchResult implements MatchResult {
    readonly matchResults: Set<MatchResult>;
    constructor(matchResults: Set<MatchResult>);
    negate(): ConjunctionMatchResult;
}
declare class ConjunctionMatchResult implements MatchResult {
    readonly matchResults: Set<MatchResult>;
    constructor(matchResults: Set<MatchResult>);
    negate(): DisjunctionMatchResult;
}
export declare function orMatchResult(...matchResults: MatchResult[]): MatchResult;
export declare function andMatchResult(...matchResults: MatchResult[]): MatchResult;
export declare function getMatchResultFromBoolean(res: boolean): TrueResult | FalseResult;
export {};
