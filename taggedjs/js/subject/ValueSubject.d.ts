import { Subject } from './Subject.class.js';
import { Subscription } from './subject.utils.js';
export type ValueSubjectSubscriber<T> = (value: T, subscription: Subscription<T>) => unknown;
export declare class ValueSubject<T> extends Subject<T> {
    value: T;
    constructor(value: T);
    subscribe(callback: ValueSubjectSubscriber<T>): Subscription<T> | Subscription<any>;
}
export declare class ValueSubjective<T> extends Subject<T> {
    value: T;
    _value: T;
    constructor(value: T);
    subscribe(callback: ValueSubjectSubscriber<T>): Subscription<any> | Subscription<T>;
}
