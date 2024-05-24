import { Subject } from './Subject.class';
export class ValueSubject extends Subject {
    constructor(value) {
        super(value);
    }
    get value() {
        return this._value;
    }
    set value(newValue) {
        this._value = newValue;
        this.set(newValue);
    }
    subscribe(callback) {
        const subscription = super.subscribe(callback);
        // Call the callback immediately with the current value
        callback(this._value, subscription);
        return subscription;
    }
}
//# sourceMappingURL=ValueSubject.js.map