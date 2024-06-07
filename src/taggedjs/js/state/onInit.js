import { state } from './state.function.js';
/** runs a callback function one time and never again. Same as calling state(() => ...) */
export function onInit(callback) {
    state(callback);
}
//# sourceMappingURL=onInit.js.map