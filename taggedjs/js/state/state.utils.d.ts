import { BaseTagSupport } from '../tag/TagSupport.class';
export type StateConfig<T> = (x: T) => [T, T];
export type StateConfigItem<T> = {
    get: () => T;
    callback?: StateConfig<T>;
    lastValue?: T;
    defaultValue?: T;
    watch?: T;
};
export type Config = {
    tagSupport?: BaseTagSupport;
    array: State;
    rearray?: State;
};
export type State = StateConfigItem<any>[];
export type GetSet<T> = (y: T) => [T, T];
export declare function getStateValue<T>(state: StateConfigItem<T>): T | undefined;
export declare class StateEchoBack {
}
export declare function getCallbackValue<T>(callback: StateConfig<T>): [T, T];
