import { Subject } from './Subject.class';
export class ValueSubject extends Subject {
    value;
    constructor(value) {
        super(value);
        this.value = value;
    }
    subscribe(callback) {
        const subscription = super.subscribe(callback);
        // Call the callback immediately with the current value
        callback(this.value);
        return subscription;
    }
}
//# sourceMappingURL=ValueSubject.js.map