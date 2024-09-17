import { Support } from '../tag/Support.class.js';
export type Provider = {
    constructMethod: any;
    instance: any;
    stateDiff: number;
    owner: Support;
    children: Support[];
};
type ProviderConstructor<T> = (new (...args: any[]) => T) | (() => T);
type functionProvider<T> = () => T;
type classProvider<T> = new (...args: any[]) => T;
type Construct<T> = classProvider<T> | functionProvider<T>;
export declare const providers: {
    create: <T>(constructMethod: Construct<T>) => T;
    /**
     * @template T
     * @param {(new (...args: any[]) => T) | () => T} constructor
     * @returns {T}
     */
    inject: <T_1>(constructor: ProviderConstructor<T_1>) => T_1;
};
export {};
