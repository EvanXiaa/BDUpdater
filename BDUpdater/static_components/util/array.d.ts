export declare function asyncFilter<T>(arr: T[], cb: (t: T) => Promise<boolean>): Promise<T[]>;
