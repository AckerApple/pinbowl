export type StateConfig = ((x?: any) => [any, any]);
export type StateConfigArray = {
    callback: StateConfig;
    lastValue?: any;
}[];
export type Config = {
    array: StateConfigArray;
    rearray: StateConfigArray;
};
export type State = {
    newest: StateConfigArray;
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
