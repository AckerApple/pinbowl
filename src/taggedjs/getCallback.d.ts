type Callback = <T>(...args: unknown[]) => T;
export declare let getCallback: () => (callback: Callback) => () => void;
export {};
