export type StateConfig<T> = (x: T) => [T, T];
export type StateConfigItem<T> = {
    callback?: StateConfig<T>;
    lastValue?: T;
    defaultValue?: T;
    watch?: T;
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
export declare function makeStateResult<T>(initValue: T, push: StateConfigItem<T>): (y: any) => T;
export declare function onNextStateOnly(callback: () => unknown): void;
export declare function getStateValue<T>(state: StateConfigItem<T>): T | undefined;
export declare class StateEchoBack {
}
/** Used for variables that need to remain the same variable during render passes */
export declare function set<T>(defaultValue: T | (() => T)): T;
