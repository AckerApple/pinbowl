import { TagSupport } from '../tag/TagSupport.class.js';
export type Provider = {
    constructMethod: any;
    instance: any;
    clone: any;
    stateDiff: number;
    owner: TagSupport;
    children: TagSupport[];
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
