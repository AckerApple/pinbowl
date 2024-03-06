import { Subject } from './Subject.js';
export class ValueSubject extends Subject {
    value;
    constructor(value) {
        super(value);
        this.value = value;
    }
    subscribe(callback) {
        const unsubscribe = super.subscribe(callback);
        // Call the callback immediately with the current value
        callback(this.value);
        return unsubscribe;
    }
}
//# sourceMappingURL=ValueSubject.js.map