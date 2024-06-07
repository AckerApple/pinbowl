import { Subject } from '../subject/index.js';
export type WatchCallback<T> = (currentValues: any[], previousValues: any[] | undefined) => T | ((currentValues: any[]) => T) | (() => T);
type WatchOperators<T> = {
    setup: WatchSetup<T>;
    /** When an item in watch array changes, callback function will be triggered. Does not trigger on initial watch setup. */
    noInit: (<T>(currentValues: any[], callback: WatchCallback<T>) => T | undefined) & MasterWatch<T>;
    /** When an item in watch array changes, callback function will be triggered */
    asSubject: (<T>(currentValues: any[], callback: WatchCallback<T>) => Subject<T>) & MasterWatch<T>;
    /** When an item in watch array changes and all values are truthy then callback function will be triggered */
    truthy: (<T>(currentValues: any[], callback: WatchCallback<T>) => T | undefined) & MasterWatch<T>;
};
type MasterWatch<T> = ((currentValues: any[], callback: WatchCallback<T>) => T) & WatchOperators<T>;
/**
 * When an item in watch array changes, callback function will be triggered. Triggers on initial watch setup. TIP: try watch.noInit()
 * @param currentValues T[]
 * @param callback WatchCallback
 * @returns T[]
 */
export declare const watch: MasterWatch<any>;
type WatchSetup<R> = {
    init?: (currentValues: any[], previousValues: any[]) => R;
    final?: (x: any) => any;
    before?: (currentValues: any[]) => boolean;
};
export {};
