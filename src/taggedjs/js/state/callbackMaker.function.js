import { setUse } from "./setUse.function";
import { getStateValue } from "./state.utils";
import { renderTagSupport } from "../renderTagSupport.function";
import { SyncCallbackError } from "../errors";
let innerCallback = (callback) => (a, b, c, d, e, f) => {
    throw new SyncCallbackError('Callback function was called immediately in sync and must instead be call async');
};
export const callbackMaker = () => innerCallback;
const originalGetter = innerCallback; // callbackMaker
setUse({
    beforeRender: (tagSupport) => initMemory(tagSupport),
    beforeRedraw: (tagSupport) => initMemory(tagSupport),
    afterRender: (_tagSupport) => {
        innerCallback = originalGetter; // prevent crossing callbacks with another tag
    },
});
function updateState(stateFrom, stateTo) {
    stateFrom.forEach((state, index) => {
        const fromValue = getStateValue(state);
        const callback = stateTo[index].callback;
        if (callback) {
            callback(fromValue); // set the value
        }
        stateTo[index].lastValue = fromValue; // record the value
    });
}
function initMemory(tagSupport) {
    const oldState = setUse.memory.stateConfig.array;
    innerCallback = (callback) => {
        const trigger = (...args) => triggerStateUpdate(tagSupport, callback, oldState, ...args);
        return trigger;
    };
}
function triggerStateUpdate(tagSupport, callback, oldState, ...args) {
    const state = tagSupport.memory.state;
    // ensure that the oldest has the latest values first
    updateState(state, oldState);
    // run the callback
    const promise = callback(...args);
    // send the oldest state changes into the newest
    updateState(oldState, state);
    renderTagSupport(tagSupport, false);
    if (promise instanceof Promise) {
        promise.finally(() => {
            // send the oldest state changes into the newest
            updateState(oldState, state);
            renderTagSupport(tagSupport, false);
        });
    }
}
//# sourceMappingURL=callbackMaker.function.js.map