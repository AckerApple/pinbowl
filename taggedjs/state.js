import { setUse } from "./setUse.function.js";
// TODO: rename
setUse.memory.stateConfig = {
    array: [], // state memory on the first render
    rearray: [], // state memory to be used before the next render
};
/**
 * @template T
 * @param {T} defaultValue
 * @returns {T}
 */
export function state(defaultValue, getSetMethod) {
    const config = setUse.memory.stateConfig;
    const restate = config.rearray[config.array.length];
    if (restate) {
        const oldValue = restate.callback ? getStateValue(restate.callback) : defaultValue;
        config.array.push({
            callback: getSetMethod,
            lastValue: oldValue
        });
        return oldValue; // return old value instead
    }
    config.array.push({
        callback: getSetMethod,
        lastValue: defaultValue,
    });
    return defaultValue;
}
setUse({
    /* beforeRender: (tagSupport: TagSupport) => {}, */
    beforeRedraw: (tagSupport) => {
        const state = tagSupport.memory.state;
        const config = setUse.memory.stateConfig;
        config.rearray.length = 0;
        if (state?.newest.length) {
            config.rearray.push(...state.newest);
        }
    },
    afterRender: (tagSupport) => {
        const state = tagSupport.memory.state;
        // const config = state.config
        const config = setUse.memory.stateConfig;
        if (config.rearray.length) {
            if (config.rearray.length !== config.array.length) {
                const message = `States lengths mismatched ${config.rearray.length} !== ${config.array.length}`;
                console.error(message, {
                    oldStates: config.array,
                    newStates: config.rearray,
                });
                throw new Error(message);
            }
        }
        config.rearray.length = 0; // clean up any previous runs
        state.newest.length = 0;
        state.newest.push(...config.array);
        config.array.length = 0;
    }
});
export function getStateValue(state) {
    const oldState = state(StateEchoBack); // get value and set to undefined
    const [oldValue] = oldState;
    const [checkValue] = state(oldValue); // set back to original value
    if (checkValue !== StateEchoBack) {
        const error = new Error('State property not used correctly.\n\n' +
            'For "let" state use `let name = state(default, x => [name, name = x])`\n\n' +
            'For "const" state use `const name = state(default)`\n\n' +
            'Problem function:\n' + state + '\n');
        throw error;
    }
    return oldValue;
}
export class StateEchoBack {
}
//# sourceMappingURL=state.js.map