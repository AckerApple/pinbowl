export type Callback<A, B, C, D, E, F, T> = (a: A, b: B, c: C, d: D, e: E, f: F) => T;
type innerCallback = <A, B, C, D, E, F, T>(_callback: Callback<A, B, C, D, E, F, T>) => (_a?: A, _b?: B, _c?: C, _d?: D, _e?: E, _f?: F) => T;
export declare const callbackMaker: () => innerCallback;
/** Wrap a function that will be called back. After the wrapper and function are called, a rendering cycle will update display */
export declare function callback<A, B, C, D, E, F, T>(callback: Callback<A, B, C, D, E, F, T>): (A?: A, B?: B, C?: C, D?: D, E?: E, F?: F) => T;
export {};
