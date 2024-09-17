import { setUseMemory } from './setUse.function.js';
/** Used for variables that need to remain the same variable during render passes */
export function state(defaultValue) {
    return setUseMemory.stateConfig.handlers.handler(defaultValue);
}
//# sourceMappingURL=state.function.js.map