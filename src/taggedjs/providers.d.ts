import { Tag } from "./Tag.class.js";
export type Provider = {
    constructMethod: any;
    instance: any;
    clone: any;
};
export declare const config: {
    providers: Provider[];
    currentTag: Tag | undefined;
    ownerTag: Tag | undefined;
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
