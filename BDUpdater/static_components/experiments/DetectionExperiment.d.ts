import { Path } from "../types";
export declare function runNewDetectionExperiments(cb: any): void;
export declare function runNewPrecisionExperiments(cb: any): void;
declare class ExpectedChange {
    truePositive: boolean | undefined;
    lineNumber: number;
    constructor(truePositive: boolean | undefined, lineNumber: number);
    toString(): string;
    get [Symbol.toStringTag](): string;
}
declare class TapirResultForFileAndPattern {
    private expectedChangesNotFound;
    private expectedChangesFound;
    private unexpectedChangesFound;
    private expectedBehavioralChangesNotFound;
    private expectedBehavioralChangesFound;
    private unexpectedBehavioralChangesFound;
    private notBenignCertainTruePositives;
    private numberCertain;
    private numberUncertain;
    constructor(expectedChangesNotFound: ExpectedChange[], expectedChangesFound: ExpectedChange[], unexpectedChangesFound: number[], expectedBehavioralChangesNotFound: ExpectedChange[], expectedBehavioralChangesFound: ExpectedChange[], unexpectedBehavioralChangesFound: number[], notBenignCertainTruePositives: number[], numberCertain: number, numberUncertain: number);
    getExpectedChangesNotFound(behavioral: boolean): number[];
    getExpectedChangesFound(behavioral: boolean): ExpectedChange[];
    getUnexpectedChangesFound(behavioral: boolean): number[];
    getTruePositives(behavioral: boolean): number[];
    getFalsePositives(behavioral: boolean): number[];
    getNotBenignCertainTruePositives(): number[];
    getNumberCertain(): number;
    getNumberUncertain(): number;
    hasResults(): boolean;
}
declare class TapirResultForClient {
    private results;
    constructor(results: Map<string, Map<Path, TapirResultForFileAndPattern>>);
    getNumberUncertain(): number;
    getNumberCertain(): number;
    getExpectedChangesNotFound(behavioral: boolean): number;
    getExpectedChangesFound(behavioral: boolean): number;
    getUnexpectedChangesFound(behavioral: boolean): number;
    unexpectedDetectionSummary(behavioral: boolean): Map<string, Map<Path, number[]>>;
    falseNegativeSummary(behavioral: boolean): Map<string, Map<Path, number[]>>;
    /**
     * Reports all expected patches (including both true positives and false positives)
     */
    expectedChangeSummary(behavioral: boolean): Map<string, Map<Path, ExpectedChange[]>>;
    summarizeResult<T>(transformValue: (v: TapirResultForFileAndPattern) => T[]): Map<string, Map<Path, T[]>>;
    sumLengthsOfResultsArray<T>(transformValue: (v: TapirResultForFileAndPattern) => T[]): number;
    sumResults(transformValue: (v: TapirResultForFileAndPattern) => number): number;
    /**
     * Reports only patches found marked as a true positive
     */
    falsePositiveSummary(behavioral: boolean): Map<string, Map<Path, number[]>>;
    getFalsePositives(behavioral: boolean): number;
    /**
     * Reports only patches found marked as a false positive
     */
    truePositiveSummary(behavioral: boolean): Map<string, Map<Path, number[]>>;
    getTruePositives(behavioral: boolean): number;
    getNumberNotBenignCertainTPs(): number;
}
declare class TapirResultForLibrary {
    private library;
    private results;
    constructor(library: string, results: TapirResultForClient[]);
    constructRQ1TableLine(showBcPerClient: boolean): string[];
    static constructRQ1TableLineFromData(library: string, numberClients: number, changesRequired: number, truePositivesNonBehavioral: number, truePositivesBehavioral: number, falsePositives: number, numberCertain: number, showBcPerClient: boolean, numberNotBenignCertainTPs: number, showNotBenignTPT?: boolean): string[];
    getNumberClients(): number;
    getNumberUncertain(): number;
    getNumberCertain(): number;
    getNumberBreakingChanges(behavioral: boolean): number;
    getRQ1FalsePositives(behavioral: boolean): number;
    getRQ1FalseNegatives(behavioral: boolean): number;
    getRQ1TruePositives(behavioral: boolean): number;
    getNumberNotBenignCertainTPs(): number;
    constructRQ2TableLine(showUnclassified: boolean, showExpectedNotFound: boolean, showNotBenignTPT?: boolean): string[];
    getRQ2NumberExpectedNotFound(behavioral: boolean): number;
    getRQ2NumberUnexpectedFound(behavioral: boolean): number;
    getRQ2FalsePositives(behavioral: boolean): number;
    getRQ2TruePositives(behavioral: boolean): number;
    getNumberClientsWithTP(): number;
    getNumberClientsWithFP(): number;
    getNumberClientsWithWarnings(): number;
    static constructRQ2TableLineFromData(library: string, numberClients: number, clientsWithWarnings: number, clientsWithTP: number, clientsWithFP: number, truePositivesNonBehavioral: number, truePositivesBehavioral: number, falsePositives: number, numberUnexpectedFound: number, numberExpectedNotFound: number, numberCertain: number, showUnclassified: boolean, showExpectedNotFound: boolean, numberNotBenignCertainTPs: number, showNotBenignTPT?: boolean): string[];
    unexpectedDetectionSummary(): Map<string, Map<Path, number[]>>;
    falseNegativeSummary(): Map<string, Map<Path, number[]>>;
    expectedChangeSummary(): Map<string, Map<string, ExpectedChange[]>>;
}
export declare class TapirResultForAllLibraries {
    private results;
    constructor(results: TapirResultForLibrary[]);
    constructRQ1Table(showBcPerClient: boolean, showNotBenignTPT?: boolean): string[][];
    private constructRQ1SummaryLine;
    constructRQ2Table(showUnclassified: boolean, showExpectedNotFound: boolean, showNotBenignTPT?: boolean): string[][];
    private constructRQ2SummaryLine;
    /**
     * Returns a map from breaking change classification to all the false positives of that classification
     */
    unexpectedChangeSummary(): Map<string, Map<Path, number[]>>;
    falseNegativeSummary(): Map<string, Map<string, number[]>>;
    expectedChangeSummary(): Map<string, Map<string, ExpectedChange[]>>;
}
export {};
