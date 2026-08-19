/**
 * Use https://astexplorer.net/ for debugging/understanding the structure of AST
 * nodes.
 */
import { Identifier, Program, Node } from 'estree';
import { AccessPathPattern, CallPattern, ImportPattern, PatternWrapper, ReadPropertyPattern, WritePropertyPattern } from "./pattern-language";
import { DisjunctionMatchResult, MaybeApplyOrSpreadArgFilterMatch, MaybeArgTypeMatch, UncertainAccPathMatch } from "../interactive/tapir-interactive";
import { AccessPath, ImportAccessPath } from "./access-path";
import { Path } from "../types";
export declare class Tapir {
    readonly module: Program;
    readonly fileName: string;
    private unknownRequires;
    private declarationAnalysisResults;
    private declaredVariableNames;
    private aliasAnalysisResults;
    private computeAccessPathsResults;
    private matchPatternResults;
    private moduleNameToVariableMap;
    private treatRelativeRequiresAsUnknown;
    constructor(fileName: string, module: Program, treatRelativeRequiresAsUnknown?: boolean);
    static createTapirFromFileName(fileName: string): Promise<Tapir>;
    getDeclAnalysisResults(): Map<Identifier, Node>;
    getModuleNameToVariableMap(): Map<string, string>;
    getDeclaredVariableNames(): Set<string>;
    getAliasAnalysisResults(): Map<Node | string, Set<Node>>;
    getComputeAccessPathsResults(): Map<Node, Set<AccessPath>>;
    getMatchPatternResults(): Map<PatternWrapper, TapirMatchResult[]>;
    declarationAnalysis(): Map<Identifier, Node>;
    aliasAnalysis(): Map<Node | string, Set<Node>>;
    computeAccessPathsPhase(): Map<Node, Set<AccessPath>>;
    computeAccessPaths(node: Node, tapir: Tapir, isAssignmentNode?: boolean): Set<AccessPath>;
    private getImportAccessPath;
    matchPattern(patternWrapper: PatternWrapper): TapirMatchResult[];
    matchImportPattern(pattern: ImportPattern): TapirMatchResult[];
    matchReadPropertyPattern(pattern: ReadPropertyPattern): TapirMatchResult[];
    matchWritePropertyPattern(pattern: WritePropertyPattern): TapirMatchResult[];
    matchCallPattern(pattern: CallPattern): TapirMatchResult[];
    doesAnyAccessPathMatchPattern(pattern: AccessPathPattern, computedAccessPaths: Set<AccessPath>): boolean | UncertainAccPathMatch;
    static runTapirOnDirectory(dirName: string, patternDescriptionFile: string, excludedFolders?: string[]): Promise<Map<Path, Map<PatternWrapper, TapirMatchResult[]>>>;
    static runTapirOnFile(fileName: string, module: Program, patterns: PatternWrapper[]): Tapir;
    computeUnknownRequires(module: Program): Set<ImportAccessPath>;
}
export type TapirMatchResult = {
    node: Node;
    fileName: string;
    uncertainAccPath?: true;
    uncertainCallFilters?: (MaybeApplyOrSpreadArgFilterMatch | MaybeArgTypeMatch | DisjunctionMatchResult)[];
};
