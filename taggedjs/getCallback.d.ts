type Callback = <T>(...args: unknown[]) => (T | void);
export declare let getCallback: () => (callback: Callback) => () => void;
export {};
