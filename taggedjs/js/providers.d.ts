export type Provider = {
    constructMethod: any;
    instance: any;
    clone: any;
};
type ProviderConstructor<T> = (new (...args: any[]) => T) | (() => T);
type functionProvider = <T>() => T;
type classProvider = new <T>(...args: any[]) => T;
export declare const providers: {
    create: <T>(constructMethod: classProvider | functionProvider) => T;
    /**
     * @template T
     * @param {(new (...args: any[]) => T) | () => T} constructor
     * @returns {T}
     */
    inject: <T_1>(constructor: ProviderConstructor<T_1>) => T_1;
};
export {};
