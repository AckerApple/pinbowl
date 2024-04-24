import { StateMismatchError } from '../errors';
import { setUse } from './setUse.function';
// TODO: rename
setUse.memory.stateConfig = {
    array: [], // state memory on the first render
    // rearray: [] as StateConfigArray, // state memory to be used before the next render
};
const beforeRender = (tagSupport) => initState(tagSupport);
setUse({
    beforeRender,
    beforeRedraw: beforeRender,
    afterRender: (tagSupport) => {
        const memory = tagSupport.memory;
        const state = memory.state;
        const config = setUse.memory.stateConfig;
        const rearray = config.rearray;
        if (rearray.length) {
            if (rearray.length !== config.array.length) {
                const message = `States lengths has changed ${rearray.length} !== ${config.array.length}. Typically occurs when a function is intended to be wrapped with a tag() call`;
                const wrapper = tagSupport.templater?.wrapper;
                const details = {
                    oldStates: config.array,
                    newStates: config.rearray,
                    tagFunction: wrapper.original,
                };
                const error = new StateMismatchError(message, details);
                console.warn(message, details);
                throw error;
            }
        }
        delete config.rearray; // clean up any previous runs
        memory.state = config.array; // [...config.array]
        memory.state.forEach(item => item.lastValue = getStateValue(item)); // set last values
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
        const message = 'State property not used correctly. Second item in array is not setting value as expected.\n\n' +
            'For "let" state use `let name = state(default)(x => [name, name = x])`\n\n' +
            'For "const" state use `const name = state(default)()`\n\n' +
            'Problem state:\n' + (callback ? callback.toString() : JSON.stringify(state)) + '\n';
        console.error(message, { state, callback, oldState, oldValue, checkValue });
        throw new Error(message);
    }
    // state.lastValue = oldValue
    return oldValue;
}
export class StateEchoBack {
}
function initState(tagSupport) {
    const memory = tagSupport.memory;
    const state = memory.state;
    const config = setUse.memory.stateConfig;
    // TODO: This guard may no longer be needed
    if (config.rearray) {
        const wrapper = tagSupport.templater?.wrapper;
        const wasWrapper = config.tagSupport?.templater.wrapper;
        const message = 'last state not cleared. Possibly in the middle of rendering one component and another is trying to render';
        console.error(message, {
            config,
            tagFunction: wrapper.original,
            wasInMiddleOf: wasWrapper.original,
            state,
            expectedClearArray: config.rearray,
        });
        throw new StateMismatchError(message, {
            config,
            tagFunction: wrapper.original,
            state,
            expectedClearArray: config.rearray,
        });
    }
    // TODO: this maybe redundant and not needed
    config.rearray = []; // .length = 0
    if (state?.length) {
        state.forEach(state => getStateValue(state));
        config.rearray.push(...state);
    }
    config.tagSupport = tagSupport;
}
//# sourceMappingURL=state.utils.js.map