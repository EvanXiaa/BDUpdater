import { Path } from '../types';
export declare class PackageOperations {
    /**
     * Performs an npm install
     */
    static npmInstall(path: Path, docker?: boolean): Promise<Path>;
    static npmInstallAndBuild(gitDir: string, docker?: boolean): Promise<ExecReturn>;
    /**
     * Clones and checks out the given repo and commit and returns the path in which the repo has been cloned.
     */
    static getPathToGitDir(gitURL: string, gitCommit: string, moduleName: string, clientName: string, install?: boolean): Promise<Path>;
    private static dockerizedCommand;
}
type ExecReturn = {
    exit: number;
    signal?: string;
    stdout: string;
    stderr: string;
};
export {};
