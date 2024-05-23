import { Subject } from "../subject";
import { getSupportInCycle } from "../tag/getSupportInCycle.function";
import { setUse } from "./setUse.function";
import { state } from "./state.function";
import { syncStates } from "./syncStates.function";
export function subject(value, onSubscription) {
    const oldestState = state(() => setUse.memory.stateConfig.array);
    const nowTagSupport = getSupportInCycle();
    return new Subject(value, onSubscription).pipe(x => {
        syncStates(nowTagSupport.memory.state, oldestState);
        return x;
    });
}
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