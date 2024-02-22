import { Subject } from './Subject.js';
export declare class ValueSubject<T> extends Subject<T> {
    value: T;
    constructor(initialValue: T);
    subscribe(callback: any): import("./Subject.js").Subscription;
}
