export type Resolve<T> = (x: T) => any;
export type Subscription<T> = (() => void) & {
    callback: SubjectSubscriber<T>;
    unsubscribe: () => Subscription<T>;
    add: (sub: Subscription<T>) => Subscription<T>;
    next: (value?: T) => any;
    subscriptions: Subscription<T>[];
};
export type SubjectSubscriber<T> = (value: T, subscription: Subscription<T>) => unknown;
export interface SubjectLike<T> {
    subscribe?: (callback: SubjectSubscriber<T>) => any;
    isSubject?: boolean;
}
export type Closer<T> = {
    createCallback: (callback: (result: T) => any) => any;
    subscribe: (subject: SubjectLike<T>) => any;
};
export type Handler<T> = (x: any) => T;
export type setHandler<T> = (x: Handler<T>) => any;
export interface UnaryFunction<T, R, RESOLVE> {
    (source: T, // lastValue
    pipeUtils: PipeUtils<RESOLVE>): R;
}
export interface OperatorFunction<T, R, RESOLVE> extends UnaryFunction<T, R, RESOLVE> {
}
export type PipeUtils<H> = {
    setHandler: setHandler<H>;
    next: (newValue: any) => any;
};
