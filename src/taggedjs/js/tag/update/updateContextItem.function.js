import { updateExistingValue } from './updateExistingValue.function.js';
/** return boolean indicated if render took place */
export function updateContextItem(contextItem, value, ownerSupport, valueType) {
    contextItem.global.nowValueType = valueType;
    // listeners will evaluate updated values to possibly update display(s)
    const result = updateExistingValue(contextItem, value, ownerSupport).rendered;
    updateOneContextValue(result, value, contextItem);
    return result;
}
export function updateOneContextValue(wasUpdated, value, contextItem) {
    contextItem.value = value;
    contextItem.global.lastValue = value;
    if (wasUpdated && !contextItem.global.locked) {
        ++contextItem.global.renderCount;
    }
}
//# sourceMappingURL=updateContextItem.function.js.map