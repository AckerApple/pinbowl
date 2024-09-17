import { Subject, defineValueOn } from './Subject.class.js';
export class ValueSubject extends Subject {
    value;
    constructor(value) {
        super(value);
        this.value = value;
    }
    subscribe(callback) {
        const subscription = super.subscribe(callback);
        // Call the callback immediately with the current value
        callback(this.value, subscription);
        return subscription;
    }
}
export class ValueSubjective extends Subject {
    value;
    constructor(value) {
        super(value);
        this.value = value;
        this._value = value;
        defineValueOn(this); // if you extend this AND have a constructor, you must call this in your extension
    }
    subscribe(callback) {
        const subscription = super.subscribe(callback);
        // Call the callback immediately with the current value
        callback(this._value, subscription);
        return subscription;
    }
}
//# sourceMappingURL=ValueSubject.js.map