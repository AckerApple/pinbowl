type Callback<A, B, C, D, E, F> = <T>(a: A, b: B, c: C, d: D, e: E, f: F) => (T | void);
export declare const callbackMaker: () => <A, B, C, D, E, F>(callback: Callback<A, B, C, D, E, F>) => (a?: A | undefined, b?: B | undefined, c?: C | undefined, d?: D | undefined, e?: E | undefined, f?: F | undefined) => void;
export {};
