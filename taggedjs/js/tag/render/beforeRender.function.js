import { initState, reState } from '../../state/state.utils.js';
import { setUseMemory } from '../../state/setUse.function.js';
export function beforeRender(support, // new
prevState) {
    // ++support.subject.renderCount
    if (prevState) {
        const lastState = prevState;
        support.state = lastState;
        reState(support, setUseMemory.stateConfig);
        return;
    }
    // first time render
    initState(support, setUseMemory.stateConfig);
}
//# sourceMappingURL=beforeRender.function.js.map