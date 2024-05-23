import { setUse } from './setUse.function';
import { getStateValue } from './state.utils';
import { syncStates } from './syncStates.function';
/** Used for variables that need to remain the same variable during render passes */
export function state(defaultValue) {
    const config = setUse.memory.stateConfig;
    let getSetMethod;
    const rearray = config.rearray;
    const restate = rearray[config.array.length];
    if (restate) {
        let oldValue = getStateValue(restate);
        getSetMethod = ((x) => [oldValue, oldValue = x]);
        const push = {
            get: () => getStateValue(push),
            callback: getSetMethod,
            lastValue: oldValue,
            defaultValue: restate.defaultValue,
        };
        config.array.push(push);
        return oldValue;
    }
    // State first time run
    const defaultFn = defaultValue instanceof Function ? defaultValue : () => defaultValue;
    let initValue = defaultFn();
    // the state is actually intended to be a function
    if (initValue instanceof Function) {
        const oldState = config.array;
        const tagSupport = config.tagSupport;
        const original = initValue;
        initValue = ((...args) => {
            const global = tagSupport.global;
            const newest = global.newest;
            const newState = newest.memory.state;
            syncStates(newState, oldState);
            const result = original(...args);
            syncStates(oldState, newState);
            return result;
        });
        initValue.original = original;
    }
    getSetMethod = ((x) => [initValue, initValue = x]);
    const push = {
        get: () => getStateValue(push),
        callback: getSetMethod,
        lastValue: initValue,
        defaultValue: initValue,
    };
    config.array.push(push);
    return initValue;
}
//# sourceMappingURL=state.function.js.map