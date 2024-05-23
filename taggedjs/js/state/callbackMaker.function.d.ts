type Callback<A, B, C, D, E, F, T> = (a: A, b: B, c: C, d: D, e: E, f: F) => T;
export declare const callbackMaker: () => <A, B, C, D, E, F, T>(callback: Callback<A, B, C, D, E, F, T>) => (a?: A | undefined, b?: B | undefined, c?: C | undefined, d?: D | undefined, e?: E | undefined, f?: F | undefined) => T;
export declare function callback<A, B, C, D, E, F, T>(callback: Callback<A, B, C, D, E, F, T>): () => T;
export {};
