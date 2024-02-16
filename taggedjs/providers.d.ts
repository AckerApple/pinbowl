export type Provider = {
    constructMethod: any;
    instance: any;
    clone: any;
};
type functionProvider = <T>() => T;
type classProvider = new <T>(...args: any[]) => T;
export declare const providers: {
    create: <T>(constructMethod: classProvider | functionProvider) => T;
    /**
     * @template T
     * @param {(new (...args: any[]) => T) | () => T} constructor
     * @returns {T}
     */
    inject: (constructor: any) => any;
};
export {};
