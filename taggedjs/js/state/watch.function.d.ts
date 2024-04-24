export type WatchCallback = (currentValues: any[], previousValues: any[] | undefined) => unknown | ((currentValues: any[]) => unknown) | (() => unknown);
/**
 * When an item in watch array changes, callback function will be triggered. Does not trigger on initial watch setup.
 * @param currentValues T[]
 * @param callback WatchCallback
 * @returns T[]
 */
export declare function watch<T>(currentValues: T[], callback: WatchCallback): T[];
