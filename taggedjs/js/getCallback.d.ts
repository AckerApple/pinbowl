type Callback = <T>(...args: unknown[]) => (T | void);
export declare const getCallback: () => (callback: Callback) => () => void;
export {};
