export type Resolve<T> = (x: T) => any;
export type Subscription = (() => void) & {
    unsubscribe: () => Subscription;
    add: (sub: Subscription) => Subscription;
    subscriptions: Subscription[];
};
export type SubjectSubscriber<T> = (...value: T[]) => unknown;
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
