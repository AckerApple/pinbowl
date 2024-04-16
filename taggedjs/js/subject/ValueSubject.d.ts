import { Subject } from './Subject.class';
import { Subscription } from './Subject.utils';
type ValueSubjectSubscriber<T> = (...value: T[]) => unknown;
export declare class ValueSubject<T> extends Subject<T> {
    value: T;
    constructor(value: T);
    subscribe(callback: ValueSubjectSubscriber<T>): Subscription;
}
export {};
