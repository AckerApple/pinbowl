import { BaseTagSupport } from '../TagSupport.class';
export type StateConfig<T> = (x: T) => [T, T];
export type StateConfigItem<T> = {
    get: () => T;
    callback?: StateConfig<T>;
    lastValue?: T;
    defaultValue?: T;
    watch?: T;
};
export type StateConfigArray = StateConfigItem<any>[];
export type Config = {
    tagSupport: BaseTagSupport;
    array: StateConfigArray;
    rearray?: StateConfigArray;
};
export type State = {
    newest: StateConfigArray;
};
export type GetSet<T> = (y: T) => [T, T];
export declare function getStateValue<T>(state: StateConfigItem<T>): T | undefined;
export declare class StateEchoBack {
}
