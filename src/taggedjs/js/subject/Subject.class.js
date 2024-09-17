import { isSubjectInstance } from '../isInstance.js';
import { combineLatest } from './combineLatest.function.js';
import { getSubscription, runPipedMethods } from './subject.utils.js';
export class Subject {
    value;
    onSubscription;
    // private?
    methods = [];
    isSubject = true;
    // private?
    subscribers = [];
    subscribeWith;
    constructor(value, 
    // private? - only used by extending classes
    onSubscription) {
        this.value = value;
        this.onSubscription = onSubscription;
        // defineValueOn(this)
    }
    subscribe(callback) {
        const subscription = getSubscription(this, callback, this.subscribers);
        // are we within a pipe?
        const subscribeWith = this.subscribeWith;
        if (subscribeWith) {
            // are we in a pipe?
            if (this.methods.length) {
                const orgCallback = callback;
                callback = (value) => {
                    runPipedMethods(value, this.methods, lastValue => orgCallback(lastValue, subscription));
                };
            }
            return subscribeWith(callback);
        }
        this.subscribers.push(subscription);
        if (this.onSubscription) {
            this.onSubscription(subscription);
        }
        return subscription;
    }
    next(value) {
        this.value = value;
        this.emit();
    }
    set = this.next.bind(this);
    emit() {
        const value = this.value;
        // Notify all subscribers with the new value
        // const subs = [...this.subscribers] // subs may change as we call callbacks
        const subs = this.subscribers; // subs may change as we call callbacks
        // const length = subs.length
        for (const sub of subs) {
            sub.callback(value, sub);
        }
    }
    toPromise() {
        return new Promise(res => {
            this.subscribe((x, subscription) => {
                subscription.unsubscribe();
                res(x);
            });
        });
    }
    /** like toPromise but faster */
    toCallback(callback) {
        const subscription = this.subscribe((x, _subscription) => {
            subscription.unsubscribe();
            callback(x);
        });
        return this;
    }
    pipe(...operations) {
        const subject = new Subject(this.value);
        subject.setMethods(operations);
        subject.subscribeWith = (x) => this.subscribe(x);
        subject.next = x => this.next(x);
        return subject;
    }
    setMethods(operations) {
        this.methods = operations;
    }
    static all(args) {
        const switched = args.map(arg => {
            if (isSubjectInstance(arg))
                return arg;
            // Call the callback immediately with the current value
            const x = new Subject(arg, subscription => {
                subscription.next(arg);
                return subscription;
            });
            return x;
        });
        return combineLatest(switched);
    }
    static globalSubCount$ = new Subject(0); // for ease of debugging}
}
export class Subjective extends Subject {
    value;
    onSubscription;
    _value;
    constructor(value, 
    // private?
    onSubscription) {
        super(value, onSubscription);
        this.value = value;
        this.onSubscription = onSubscription;
        this._value = value;
        defineValueOn(this);
    }
    next(value) {
        this._value = value;
        this.emit();
    }
    emit() {
        const value = this._value;
        // Notify all subscribers with the new value
        // const subs = [...this.subscribers] // subs may change as we call callbacks
        const subs = this.subscribers; // subs may change as we call callbacks
        // const length = subs.length
        for (const sub of subs) {
            sub.callback(value, sub);
        }
    }
}
export function defineValueOn(subject) {
    Object.defineProperty(subject, 'value', {
        // supports subject.value = x
        set(value) {
            subject._value = value;
            subject.emit();
        },
        // supports subject.value
        get() {
            return subject._value;
        }
    });
}
//# sourceMappingURL=Subject.class.js.map