export type Provider = {
    constructMethod: any;
    instance: any;
    clone: any;
};
export declare const providers: {
    /**
     * @template T
     * @param {(new (...args: any[]) => T) | () => T} constructor
     * @returns {T}
     */
    create: (constructMethod: any) => any;
    /**
     * @template T
     * @param {(new (...args: any[]) => T) | () => T} constructor
     * @returns {T}
     */
    inject: (constructor: any) => any;
};
