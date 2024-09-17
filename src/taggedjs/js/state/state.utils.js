import { firstLetState, reLetState } from './letState.function.js';
import { runFirstState, runRestate } from './stateHandlers.js';
export function initState(support, config) {
    config.handlers.handler = runFirstState;
    config.handlers.letHandler = firstLetState;
    config.rearray = [];
    config.array = [];
    config.support = support;
}
export function reState(support, config) {
    const state = support.state;
    config.rearray = state;
    config.array = [];
    config.handlers.handler = runRestate;
    config.handlers.letHandler = reLetState;
    config.support = support;
}
export class StateEchoBack {
}
// sends a fake value and then sets back to received value
export function getCallbackValue(callback) {
    const oldState = callback(StateEchoBack); // get value and set to undefined
    const [value] = oldState;
    const [checkValue] = callback(value); // set back to original value
    return [value, checkValue];
}
//# sourceMappingURL=state.utils.js.map