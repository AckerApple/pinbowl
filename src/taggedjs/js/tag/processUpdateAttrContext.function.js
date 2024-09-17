import { processAttributeEmit, updateNameOnlyAttrValue } from '../interpolations/attributes/processAttribute.function.js';
export function processUpdateAttrContext(values, value, contextItem, ownerSupport) {
    if (contextItem.isNameOnly) {
        updateNameOnlyAttrValue(values, value, contextItem.value, contextItem.element, // global.element as Element,
        ownerSupport, contextItem.howToSet, []);
        contextItem.value = value;
        return;
    }
    const element = contextItem.element;
    processAttributeEmit(value, contextItem.attrName, contextItem, element, ownerSupport, contextItem.howToSet, contextItem.isSpecial);
    contextItem.value = value;
    return;
}
//# sourceMappingURL=processUpdateAttrContext.function.js.map