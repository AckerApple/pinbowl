type Callback<A> = <T>(...args: A[]) => (T | void);
export declare const callbackMaker: () => <A>(callback: Callback<A>) => (...args: A[]) => void;
export {};
