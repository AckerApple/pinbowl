export class Subject {
    value;
    isSubject = true;
    subscribers = [];
    // unsubcount = 0 // 🔬 testing
    constructor(value) {
        this.value = value;
    }
    subscribe(callback) {
        this.subscribers.push(callback);
        SubjectClass.globalSubs.push(callback); // 🔬 testing
        const countSubject = SubjectClass.globalSubCount$;
        SubjectClass.globalSubCount$.set(countSubject.value + 1);
        const unsubscribe = () => {
            unsubscribe.unsubscribe();
        };
        // Return a function to unsubscribe from the BehaviorSubject
        unsubscribe.unsubscribe = () => {
            removeSubFromArray(this.subscribers, callback);
            removeSubFromArray(SubjectClass.globalSubs, callback); // 🔬 testing
            SubjectClass.globalSubCount$.set(countSubject.value - 1);
            // any double unsubscribes will be ignored
            unsubscribe.unsubscribe = () => undefined;
        };
        return unsubscribe;
    }
    set(value) {
        this.value = value;
        // Notify all subscribers with the new value
        this.subscribers.forEach((callback) => {
            callback.value = value;
            callback(value);
        });
    }
    next = this.set;
}
function removeSubFromArray(subscribers, callback) {
    const index = subscribers.indexOf(callback);
    if (index !== -1) {
        subscribers.splice(index, 1);
    }
}
const SubjectClass = Subject;
SubjectClass.globalSubs = []; // 🔬 for testing
SubjectClass.globalSubCount$ = new Subject(); // for ease of debugging
SubjectClass.globalSubCount$.set(0);
//# sourceMappingURL=Subject.js.map