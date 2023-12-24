import { setUse } from "./tagRunner.js";
export const config = {
    array: [],
    rearray: [],
};
/**
 * @template T
 * @param {T} defaultValue
 * @returns {T}
 */
export function state(defaultValue, getSetMethod) {
    const restate = config.rearray[config.array.length];
    if (restate) {
        const oldValue = getStateValue(restate);
        config.array.push(getSetMethod);
        return oldValue; // return old value instead
    }
    config.array.push(getSetMethod);
    return defaultValue;
}
setUse({
    beforeRender: (tagSupport) => {
        tagSupport.state = tagSupport.state || {
            newest: [], // oldest: [],
        };
    },
    beforeRedraw: (tagSupport) => {
        const state = tagSupport.state;
        config.rearray.length = 0;
        if (state?.newest.length) {
            // state.oldest = [...state.newest]
            config.rearray.push(...state.newest);
        }
    },
    afterRender: (tagSupport) => {
        if (config.rearray.length) {
            if (config.rearray.length !== config.array.length) {
                throw new Error(`States lengths mismatched ${config.rearray.length} !== ${config.array.length}`);
            }
        }
        config.rearray.length = 0; // clean up any previous runs
        const state = tagSupport.state;
        state.newest.length = 0;
        state.newest.push(...config.array);
        state.oldest = state.oldest || [...config.array]; // always preserve oldest
        config.array.length = 0;
    }
});
export function getStateValue(state) {
    const [oldValue] = state(EchoBack); // get value and set to undefined
    const [checkValue] = state(oldValue); // set back to original value
    if (checkValue !== EchoBack) {
        const error = new Error('State property not used correctly.\n\n' +
            'For "let" state use `let name = state(default, x => [name, name = x])`\n\n' +
            'For "const" state use `const name = state(default)`\n\n' +
            'Problem function:\n' + state + '\n');
        throw error;
    }
    return oldValue;
}
class EchoBack {
}
//# sourceMappingURL=state.js.map