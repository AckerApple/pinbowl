import { getStateValue } from "./set.function.js";
import { setUse } from "./setUse.function.js";
/** Used for variables that need to remain the same variable during render passes */
export function setProp(getSet) {
    const config = setUse.memory.stateConfig;
    const [propValue] = getSet(undefined);
    getSet(propValue); // restore original value instead of undefined
    const restate = config.rearray[config.array.length];
    if (restate) {
        let watchValue = restate.watch;
        let oldValue = getStateValue(restate);
        const push = {
            callback: getSet,
            lastValue: oldValue,
            watch: restate.watch,
        };
        // has the prop value changed?
        if (propValue != watchValue) {
            push.watch = propValue;
            oldValue = push.lastValue = propValue;
        }
        config.array.push(push);
        getSet(oldValue);
        return oldValue;
    }
    const push = {
        callback: getSet,
        lastValue: propValue,
        watch: propValue,
    };
    config.array.push(push);
    return propValue;
}
//# sourceMappingURL=setProp.function.js.map