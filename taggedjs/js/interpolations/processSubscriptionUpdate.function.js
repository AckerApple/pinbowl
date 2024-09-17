import { updateExistingValue } from '../tag/update/updateExistingValue.function.js';
import { setUseMemory } from '../state/setUse.function.js';
import { paint } from '../tag/paint.function.js';
export function processSubUpdate(value, contextItem, support) {
    if (value === contextItem.value) {
        return; // same value emitted
    }
    updateExistingValue(contextItem, value, support);
    if (!setUseMemory.stateConfig.support) {
        paint();
    }
    return;
}
//# sourceMappingURL=processSubscriptionUpdate.function.js.map