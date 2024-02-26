export type StateConfig<T> = (x: T) => [T, T];
type StateConfigItem<T> = {
    callback?: StateConfig<T>;
    lastValue?: any;
    defaultValue?: any;
};
export type StateConfigArray = StateConfigItem<any>[];
export type Config = {
    array: StateConfigArray;
    rearray: StateConfigArray;
};
export type State = {
    newest: StateConfigArray;
};
export type GetSet<T> = (y: T) => [T, T];
/** Used for variables that need to remain the same variable during render passes */
export declare function state<T>(defaultValue: T | (() => T)): ((getSet?: GetSet<T>) => T);
export declare function onNextStateOnly(callback: () => unknown): void;
export declare function getStateValue<T>(state: StateConfigItem<T>): any;
export declare class StateEchoBack {
}
export {};
