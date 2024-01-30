export type StateConfig = ((x?: any) => [any, any]);
export type StateConfigArray = {
    callback: StateConfig;
    lastValue?: any;
}[];
export type State = {
    newest: StateConfigArray;
    oldest?: StateConfigArray;
};
export declare const config: {
    array: StateConfigArray;
    rearray: StateConfigArray;
};
/**
 * @template T
 * @param {T} defaultValue
 * @returns {T}
 */
export declare function state<T>(defaultValue: T, getSetMethod?: (x: T) => [T, T]): T;
export declare function getStateValue(state: StateConfig): any;
export declare class StateEchoBack {
}
