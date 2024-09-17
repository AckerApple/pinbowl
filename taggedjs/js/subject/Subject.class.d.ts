import { OperatorFunction, SubjectLike, SubjectSubscriber, Subscription } from './subject.utils.js';
export type OnSubscription<T> = (subscription: Subscription<T>) => unknown;
export declare class Subject<T> implements SubjectLike<T> {
    value?: T | undefined;
    onSubscription?: OnSubscription<T> | undefined;
    methods: OperatorFunction<any, any, any>[];
    isSubject: boolean;
    subscribers: Subscription<T>[];
    subscribeWith?: (x: SubjectSubscriber<T>) => Subscription<T>;
    constructor(value?: T | undefined, onSubscription?: OnSubscription<T> | undefined);
    subscribe(callback: SubjectSubscriber<T>): Subscription<T> | Subscription<any>;
    next(value?: any): void;
    set: (value?: any) => void;
    emit(): void;
    toPromise(): Promise<T>;
    /** like toPromise but faster */
    toCallback(callback: (x: T) => any): this;
    pipe(): Subject<T>;
    pipe<A, RESOLVE>(op1: OperatorFunction<T, A, RESOLVE>): Subject<A>;
    pipe<A, B, RESOLVE>(op1: OperatorFunction<T, A, RESOLVE>, op2: OperatorFunction<A, B, RESOLVE>): Subject<B>;
    pipe<A, B, C, RESOLVE>(op1: OperatorFunction<T, A, RESOLVE>, op2: OperatorFunction<A, B, RESOLVE>, op3: OperatorFunction<B, C, RESOLVE>): Subject<C>;
    pipe<A, B, C, D, RESOLVE>(op1: OperatorFunction<T, A, RESOLVE>, op2: OperatorFunction<A, B, RESOLVE>, op3: OperatorFunction<B, C, RESOLVE>, op4: OperatorFunction<C, D, RESOLVE>): Subject<D>;
    pipe<A, B, C, D, E, RESOLVE>(op1: OperatorFunction<T, A, RESOLVE>, op2: OperatorFunction<A, B, RESOLVE>, op3: OperatorFunction<B, C, RESOLVE>, op4: OperatorFunction<C, D, RESOLVE>, op5: OperatorFunction<D, E, RESOLVE>): Subject<E>;
    pipe<A, B, C, D, E, F, RESOLVE>(op1: OperatorFunction<T, A, RESOLVE>, op2: OperatorFunction<A, B, RESOLVE>, op3: OperatorFunction<B, C, RESOLVE>, op4: OperatorFunction<C, D, RESOLVE>, op5: OperatorFunction<D, E, RESOLVE>, op6: OperatorFunction<E, F, RESOLVE>): Subject<F>;
    pipe<A, B, C, D, E, F, G, RESOLVE>(op1: OperatorFunction<T, A, RESOLVE>, op2: OperatorFunction<A, B, RESOLVE>, op3: OperatorFunction<B, C, RESOLVE>, op4: OperatorFunction<C, D, RESOLVE>, op5: OperatorFunction<D, E, RESOLVE>, op6: OperatorFunction<E, F, RESOLVE>, op7: OperatorFunction<F, G, RESOLVE>): Subject<G>;
    pipe<A, B, C, D, E, F, G, H, RESOLVE>(op1: OperatorFunction<T, A, RESOLVE>, op2: OperatorFunction<A, B, RESOLVE>, op3: OperatorFunction<B, C, RESOLVE>, op4: OperatorFunction<C, D, RESOLVE>, op5: OperatorFunction<D, E, RESOLVE>, op6: OperatorFunction<E, F, RESOLVE>, op7: OperatorFunction<F, G, RESOLVE>, op8: OperatorFunction<G, H, RESOLVE>): Subject<H>;
    pipe<A, B, C, D, E, F, G, H, I, RESOLVE>(op1: OperatorFunction<T, A, RESOLVE>, op2: OperatorFunction<A, B, RESOLVE>, op3: OperatorFunction<B, C, RESOLVE>, op4: OperatorFunction<C, D, RESOLVE>, op5: OperatorFunction<D, E, RESOLVE>, op6: OperatorFunction<E, F, RESOLVE>, op7: OperatorFunction<F, G, RESOLVE>, op8: OperatorFunction<G, H, RESOLVE>, op9: OperatorFunction<H, I, RESOLVE>): Subject<I>;
    pipe<A, B, C, D, E, F, G, H, I, RESOLVE>(op1: OperatorFunction<T, A, RESOLVE>, op2: OperatorFunction<A, B, RESOLVE>, op3: OperatorFunction<B, C, RESOLVE>, op4: OperatorFunction<C, D, RESOLVE>, op5: OperatorFunction<D, E, RESOLVE>, op6: OperatorFunction<E, F, RESOLVE>, op7: OperatorFunction<F, G, RESOLVE>, op8: OperatorFunction<G, H, RESOLVE>, op9: OperatorFunction<H, I, RESOLVE>, ...operations: OperatorFunction<any, any, any>[]): Subject<unknown>;
    setMethods(operations: OperatorFunction<any, any, any>[]): void;
    static all<A, B, C, D, E, F>(args: [Subject<A> | A, Subject<B> | B, Subject<C> | C, Subject<D> | D, Subject<E> | E, Subject<F> | F]): Subject<[A, B, C, D, E, F]>;
    static all<A, B, C, D, E>(args: [Subject<A> | A, Subject<B> | B, Subject<C> | C, Subject<D> | D, Subject<E> | E]): Subject<[A, B, C, D, E]>;
    static all<A, B, C, D>(args: [Subject<A> | A, Subject<B> | B, Subject<C> | C, Subject<D> | D]): Subject<[A, B, C, D]>;
    static all<A, B, C>(args: [Subject<A> | A, Subject<B> | B, Subject<C> | C]): Subject<[A, B, C]>;
    static all<A, B>(args: [Subject<A> | A, Subject<B> | B]): Subject<[A, B]>;
    static all<A>(args: [Subject<A> | A]): Subject<[A]>;
    static globalSubCount$: Subject<number>;
}
export declare class Subjective<T> extends Subject<T> {
    value?: T | undefined;
    onSubscription?: OnSubscription<T> | undefined;
    _value?: T;
    constructor(value?: T | undefined, onSubscription?: OnSubscription<T> | undefined);
    next(value?: any): void;
    emit(): void;
}
export declare function defineValueOn(subject: Subjective<any>): void;
