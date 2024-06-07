import { renderTagSupport } from '../tag/render/renderTagSupport.function.js';
import { syncStates } from './syncStates.function.js';
export default function callbackStateUpdate(tagSupport, callback, oldState, ...args) {
    const state = tagSupport.memory.state;
    // ensure that the oldest has the latest values first
    syncStates(state, oldState);
    // run the callback
    const maybePromise = callback(...args);
    // send the oldest state changes into the newest
    syncStates(oldState, state);
    renderTagSupport(tagSupport, // tagSupport.global.newest as TagSupport,
    false);
    if (maybePromise instanceof Promise) {
        maybePromise.finally(() => {
            // send the oldest state changes into the newest
            syncStates(oldState, state);
            renderTagSupport(tagSupport, // tagSupport.global.newest as TagSupport,
            false);
        });
    }
    // return undefined as T
    return maybePromise;
}
//# sourceMappingURL=callbackStateUpdate.function.js.map