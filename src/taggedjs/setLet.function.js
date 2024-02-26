import { getStateValue, makeStateResult } from "./set.function.js";
import { setUse } from "./setUse.function.js";
/** Used for variables that need to remain the same variable during render passes */
export function setLet(defaultValue) {
    const config = setUse.memory.stateConfig;
    let getSetMethod;
    const restate = config.rearray[config.array.length];
    if (restate) {
        let oldValue = getStateValue(restate);
        getSetMethod = ((x) => [oldValue, oldValue = x]);
        const push = {
            callback: getSetMethod,
            lastValue: oldValue,
            defaultValue: restate.defaultValue,
        };
        config.array.push(push);
        return makeStateResult(oldValue, push);
    }
    // State first time run
    const defaultFn = defaultValue instanceof Function ? defaultValue : () => defaultValue;
    let initValue = defaultFn();
    getSetMethod = ((x) => [initValue, initValue = x]);
    const push = {
        callback: getSetMethod,
        lastValue: initValue,
        defaultValue: initValue,
    };
    config.array.push(push);
    return makeStateResult(initValue, push);
}
//# sourceMappingURL=setLet.function.js.map