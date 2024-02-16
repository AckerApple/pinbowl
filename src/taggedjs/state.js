import { setUse } from "./setUse.function.js";
// TODO: rename
setUse.memory.stateConfig = {
    array: [], // state memory on the first render
    rearray: [], // state memory to be used before the next render
};
/** Used for variables that need to remain the same variable during render passes */
export function state(defaultValue) {
    const config = setUse.memory.stateConfig;
    let getSetMethod;
    const restate = config.rearray[config.array.length];
    if (restate) {
        let oldValue = getStateValue(restate);
        getSetMethod = (x => [oldValue, oldValue = x]);
        const push = {
            callback: getSetMethod,
            lastValue: oldValue,
            defaultValue: restate.defaultValue,
        };
        config.array.push(push);
        return (y) => {
            push.callback = y || (x => [oldValue, oldValue = x]);
            return oldValue;
        };
    }
    const defaultFn = defaultValue instanceof Function ? defaultValue : () => defaultValue;
    let initValue = defaultFn();
    getSetMethod = (x => [initValue, initValue = x]);
    const push = {
        callback: getSetMethod,
        lastValue: initValue,
        defaultValue: initValue,
    };
    config.array.push(push);
    // return initValue
    return (y) => {
        push.callback = y || (x => [initValue, initValue = x]);
        return initValue;
    };
}
setUse({
    beforeRender: (tagSupport) => initState(tagSupport),
    beforeRedraw: (tagSupport) => initState(tagSupport),
    afterRender: (tagSupport, tag) => {
        const state = tagSupport.memory.state;
        const config = setUse.memory.stateConfig;
        if (config.rearray.length) {
            if (config.rearray.length !== config.array.length) {
                const message = `States lengths mismatched ${config.rearray.length} !== ${config.array.length}`;
                console.error(message, {
                    oldStates: config.array,
                    newStates: config.rearray,
                    component: tagSupport.templater?.wrapper.original
                });
                throw new Error(message);
            }
        }
        // config.rearray.length = 0 // clean up any previous runs
        config.rearray = []; // clean up any previous runs
        // state.newest.length = 0
        // state.newest.push(...config.array) as any
        state.newest = [...config.array];
        // config.array.length = 0
        config.array = [];
    }
});
export function getStateValue(
// state: StateConfig,
state) {
    const callback = state.callback;
    if (!callback) {
        return state.defaultValue;
    }
    const oldState = callback(StateEchoBack); // get value and set to undefined
    const [oldValue] = oldState;
    const [checkValue] = callback(oldValue); // set back to original value
    if (checkValue !== StateEchoBack) {
        const message = 'State property not used correctly.\n\n' +
            'For "let" state use `let name = state(default, x => [name, name = x])`\n\n' +
            'For "const" state use `const name = state(default)`\n\n' +
            'Problem function:\n' + state + '\n';
        // console.error(message, {callback, oldState, oldValue, checkValue})
        throw new Error(message);
    }
    return oldValue;
}
export class StateEchoBack {
}
function initState(tagSupport) {
    const state = tagSupport.memory.state;
    const config = setUse.memory.stateConfig;
    // TODO: This guard may no longer be needed
    if (config.rearray.length) {
        const message = 'last array not cleared';
        console.error(message, {
            config,
            component: tagSupport.templater?.wrapper.original,
            state,
        });
        throw message;
    }
    // TODO: this maybe redundant and not needed
    config.rearray = []; // .length = 0
    if (state?.newest.length) {
        config.rearray.push(...state.newest);
    }
}
//# sourceMappingURL=state.js.map