import { Path } from './types';
export declare class StaticConfiguration {
    static projectHome: string;
    static outPath: Path;
    static resPath: Path;
    static gitPath: Path;
    static dockerFolder: string;
    static ignoreAccessPathsForOrdinaryCalls: boolean;
    static failAccessPathsUsingThirdPartyModules: boolean;
    static assumeUnknownReceiverMatches: boolean;
    static assumeFirstReceiverMatchOnUnknownLibraryObject: boolean;
    static checkForDeprecations: boolean;
    static useFilesFromPreviousGitCloneWhenRunningExperiments: boolean;
    /**
     * returns true if running the mocha tests
     */
    static isRunningTests(): boolean;
}
