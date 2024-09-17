import { Subject } from './Subject.class.js';
function removeSubFromArray(subscribers, callback) {
    const index = subscribers.findIndex(sub => sub.callback === callback);
    if (index !== -1) {
        subscribers.splice(index, 1);
    }
}
export function getSubscription(subject, callback, subscribers) {
    const countSubject = Subject.globalSubCount$;
    Subject.globalSubCount$.next(countSubject.value + 1);
    const subscription = function () {
        subscription.unsubscribe();
    };
    subscription.callback = callback;
    subscription.subscriptions = [];
    // Return a function to unsubscribe from the BehaviorSubject
    subscription.unsubscribe = function () {
        return unsubscribe(subscription, subscribers, callback);
    };
    subscription.add = (sub) => {
        subscription.subscriptions.push(sub);
        return subscription;
    };
    subscription.next = (value) => {
        callback(value, subscription);
    };
    return subscription;
}
export function runPipedMethods(value, methods, onComplete) {
    const cloneMethods = [...methods];
    const firstMethod = cloneMethods.shift();
    const next = (newValue) => {
        if (cloneMethods.length) {
            return runPipedMethods(newValue, cloneMethods, onComplete);
        }
        onComplete(newValue);
    };
    let handler = next;
    const setHandler = (x) => handler = x;
    const pipeUtils = { setHandler, next };
    const methodResponse = firstMethod(value, pipeUtils);
    handler(methodResponse);
}
function unsubscribe(subscription, subscribers, callback) {
    removeSubFromArray(subscribers, callback); // each will be called when update comes in
    const valSub = Subject.globalSubCount$;
    Subject.globalSubCount$.next(valSub.value - 1);
    // any double unsubscribes will be ignored
    subscription.unsubscribe = () => subscription;
    // unsubscribe from any combined subjects
    const subscriptions = subscription.subscriptions;
    for (const sub of subscriptions) {
        sub.unsubscribe();
    }
    return subscription;
}
//# sourceMappingURL=subject.utils.js.map