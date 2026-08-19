import { Path } from '../types';
export declare function createDirectoryIfMissing(file: Path): Promise<void>;
export declare function isDirectory(dir: Path): Promise<boolean>;
/**
 * returns all files (including directories) in path with fileExtension if specified
 * @param dir
 * @param recursive: reads sub directories
 * @param fileExtension: Only returns files with fileExtension if specified
 */
export declare function readDir(dir: Path, recursive?: boolean, fileExtensions?: string[], excluded?: string[], excludedFiles?: string[]): Promise<Path[]>;
export declare function getFilesToAnalyze(directory: string, excludedFolders?: string[], excludedFiles?: string[]): Promise<string[]>;
