export type StateConfig<T> = (x: T) => [T, T];
export type StateConfigItem<T> = {
    get: () => T;
    callback?: StateConfig<T>;
    defaultValue?: T;
    watch?: T;
};
export type State = StateConfigItem<any>[];
