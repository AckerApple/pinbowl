import { Subject } from './Subject.class';
import { Subscription } from './subject.utils';
type ValueSubjectSubscriber<T> = (value: T, subscription: Subscription<T>) => unknown;
export declare class ValueSubject<T> extends Subject<T> {
    value: T;
    constructor(value: T);
    subscribe(callback: ValueSubjectSubscriber<T>): Subscription<T> | Subscription<any>;
}
export {};
