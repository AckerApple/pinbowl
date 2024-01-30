import { Subject } from './Subject.js';
export declare class ValueSubject extends Subject {
    value: any;
    constructor(initialValue: any);
    subscribe(callback: any): import("./Subject.js").Subscription;
}
