import { getStateValue } from './getStateValue.function.js';
import { BasicTypes } from '../tag/ValueTypes.enum.js';
import { setUseMemory } from './setUse.function.js';
/** Used for variables that need to remain the same variable during render passes. If defaultValue is a function it is called only once, its return value is first state, and let value can changed */
export function letState(defaultValue) {
    const config = setUseMemory.stateConfig;
    return config.handlers.letHandler(defaultValue);
}
export function firstLetState(defaultValue) {
    const config = setUseMemory.stateConfig;
    // State first time run
    const initValue = typeof (defaultValue) === BasicTypes.function ? defaultValue() : defaultValue;
    const push = {
        get: function getPushState() {
            return getStateValue(push);
        },
        defaultValue: initValue,
    };
    config.array.push(push);
    return makeStateResult(initValue, push);
}
export function reLetState() {
    const config = setUseMemory.stateConfig;
    const rearray = config.rearray;
    const restate = rearray[config.array.length];
    const oldValue = getStateValue(restate);
    const push = {
        get: function getLetState() {
            return getStateValue(push);
        },
        defaultValue: restate.defaultValue,
    };
    config.array.push(push);
    return makeStateResult(oldValue, push);
}
function makeStateResult(initValue, push) {
    return function msr(y) {
        push.callback = y;
        return initValue;
    };
}
//# sourceMappingURL=letState.function.js.map