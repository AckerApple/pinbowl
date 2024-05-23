import { setUse } from "./setUse.function";
import { renderTagSupport } from "../tag/render/renderTagSupport.function";
import { SyncCallbackError } from "../errors";
import { syncStates } from "./syncStates.function";
import { getSupportInCycle } from "../tag/getSupportInCycle.function";
let innerCallback = (callback) => (a, b, c, d, e, f) => {
    throw new SyncCallbackError('Callback function was called immediately in sync and must instead be call async');
};
export const callbackMaker = () => innerCallback;
const originalGetter = innerCallback; // callbackMaker
setUse({
    beforeRender: (tagSupport) => initMemory(tagSupport),
    beforeRedraw: (tagSupport) => initMemory(tagSupport),
    afterRender: (tagSupport) => {
        ;
        tagSupport.global.callbackMaker = true;
        innerCallback = originalGetter; // prevent crossing callbacks with another tag
    },
});
export function callback(callback) {
    const tagSupport = getSupportInCycle();
    if (!tagSupport) {
        const error = new SyncCallbackError('callback() was called outside of synchronous rendering. Use `callback = callbackMaker()` to create a callback that could be called out of sync with rendering');
        throw error;
    }
    const oldState = setUse.memory.stateConfig.array;
    const trigger = (...args) => {
        const callbackMaker = tagSupport.global.callbackMaker;
        if (callbackMaker) {
            return triggerStateUpdate(tagSupport, callback, oldState, ...args);
        }
        return callback(...args);
    };
    return trigger;
}
function initMemory(tagSupport) {
    const oldState = setUse.memory.stateConfig.array;
    innerCallback = (callback) => {
        const trigger = (...args) => {
            const callbackMaker = tagSupport.global.callbackMaker;
            if (callbackMaker) {
                return triggerStateUpdate(tagSupport, callback, oldState, ...args);
            }
            return callback(...args);
        };
        return trigger;
    };
}
function triggerStateUpdate(tagSupport, callback, oldState, ...args) {
    const state = tagSupport.memory.state;
    // ensure that the oldest has the latest values first
    syncStates(state, oldState);
    // run the callback
    const maybePromise = callback(...args);
    // send the oldest state changes into the newest
    syncStates(oldState, state);
    /*
    if(tagSupport.global.deleted) {
      return maybePromise // While running callback the tag was deleted. Often that happens
    }
    */
    renderTagSupport(tagSupport, false);
    if (maybePromise instanceof Promise) {
        maybePromise.finally(() => {
            // send the oldest state changes into the newest
            syncStates(oldState, state);
            renderTagSupport(tagSupport, false);
        });
    }
    // return undefined as T
    return maybePromise;
}
//# sourceMappingURL=callbackMaker.function.js.map