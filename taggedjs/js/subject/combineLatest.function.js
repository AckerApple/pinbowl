import { Subject } from './Subject.class.js';
export function combineLatest(subjects) {
    const output = new Subject();
    const subscribe = (callback) => {
        const valuesSeen = [];
        const values = [];
        const setValue = (x, index) => {
            valuesSeen[index] = true;
            values[index] = x;
            const countMatched = valuesSeen.length === subjects.length;
            if (!countMatched) {
                return;
            }
            for (const item of valuesSeen) {
                if (!item) {
                    return;
                }
            }
            // everyone has reported values
            callback(values, subscription);
        };
        const clones = [...subjects];
        const firstSub = clones.shift();
        const subscription = firstSub.subscribe(x => setValue(x, 0));
        const subscriptions = clones.map((subject, index) => {
            return subject.subscribe(x => setValue(x, index + 1));
        });
        subscription.subscriptions = subscriptions;
        return subscription;
    };
    output.subscribeWith = subscribe;
    return output;
}
//# sourceMappingURL=combineLatest.function.js.map