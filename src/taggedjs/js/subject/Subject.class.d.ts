import { OperatorFunction, SubjectLike, SubjectSubscriber, Subscription } from "./Subject.utils";
export declare class Subject<T> implements SubjectLike<T> {
    value?: T | undefined;
    methods: OperatorFunction<any, any, any>[];
    isSubject: boolean;
    subscribers: SubjectSubscriber<T>[];
    subscribeWith?: (x: SubjectSubscriber<T>) => Subscription;
    constructor(value?: T | undefined);
    subscribe(callback: SubjectSubscriber<T>): Subscription;
    set(value: any): void;
    next: (value: any) => void;
    toPromise(): Promise<T>;
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
}
