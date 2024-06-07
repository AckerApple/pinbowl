import { Subject, ValueSubject } from '../subject/index.js';
import { getSupportInCycle } from '../tag/getSupportInCycle.function.js';
import { setUse } from './setUse.function.js';
import { state } from './state.function.js';
import { syncStates } from './syncStates.function.js';
/** Create a Subject that on updates will sync state values to keep chained functions using latest variables */
export function subject(value, onSubscription) {
    const oldestState = state(() => setUse.memory.stateConfig.array);
    const nowTagSupport = getSupportInCycle();
    return state(() => {
        const subject = new Subject(value, onSubscription).pipe(x => {
            syncStates(nowTagSupport.memory.state, oldestState);
            return x;
        });
        return subject;
    });
}
subject._value = (value) => {
    const oldestState = state(() => setUse.memory.stateConfig.array);
    const nowTagSupport = getSupportInCycle();
    return state(() => {
        const subject = new ValueSubject(value).pipe(x => {
            syncStates(nowTagSupport.memory.state, oldestState);
            return x;
        });
        return subject;
    });
};
function all(args) {
    const oldestState = state(() => setUse.memory.stateConfig.array);
    const nowTagSupport = getSupportInCycle();
    return Subject.all(args).pipe(x => {
        syncStates(nowTagSupport.memory.state, oldestState);
        return x;
    });
}
subject.all = all;
//# sourceMappingURL=subject.function.js.map