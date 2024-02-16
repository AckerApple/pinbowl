import { Subject } from './Subject.js';
export declare class ValueSubject<T> extends Subject<T> {
    value: any;
    constructor(initialValue: any);
    subscribe(callback: any): import("./Subject.js").Subscription;
}
