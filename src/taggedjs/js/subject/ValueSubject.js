import { Subject, defineValueOn } from './Subject.class.js';
export class ValueSubject extends Subject {
    value;
    constructor(value) {
        super(value);
        this.value = value;
        defineValueOn(this);
    }
    subscribe(callback) {
        const subscription = super.subscribe(callback);
        // Call the callback immediately with the current value
        callback(this._value, subscription);
        return subscription;
    }
}
//# sourceMappingURL=ValueSubject.js.map