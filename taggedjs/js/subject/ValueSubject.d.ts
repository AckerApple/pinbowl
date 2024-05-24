import { Subject } from './Subject.class';
import { Subscription } from './subject.utils';
type ValueSubjectSubscriber<T> = (value: T, subscription: Subscription<T>) => unknown;
export declare class ValueSubject<T> extends Subject<T> {
    _value: T;
    constructor(value: T);
    get value(): T;
    set value(newValue: T);
    subscribe(callback: ValueSubjectSubscriber<T>): Subscription<any> | Subscription<T>;
}
export {};
