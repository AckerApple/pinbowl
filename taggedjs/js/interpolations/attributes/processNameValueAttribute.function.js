// taggedjs-no-compile
import { specialAttribute } from './specialAttribute.js';
import { processTagCallbackFun } from './processAttribute.function.js';
import { BasicTypes } from '../../tag/ValueTypes.enum.js';
export function processDynamicNameValueAttribute(attrName, value, contextItem, element, howToSet, support, isSpecial) {
    contextItem.attrName = attrName;
    contextItem.element = element;
    contextItem.howToSet = howToSet;
    if (typeof (value) === BasicTypes.function) {
        return processTagCallbackFun(contextItem, value, support, attrName, element);
    }
    contextItem.attrName = attrName;
    contextItem.element = element;
    contextItem.howToSet = howToSet;
    contextItem.isSpecial = isSpecial;
    return processNonDynamicAttr(attrName, value, element, howToSet, isSpecial);
}
export function processNonDynamicAttr(attrName, value, element, howToSet, isSpecial) {
    if (isSpecial) {
        return specialAttribute(attrName, value, element, isSpecial);
    }
    howToSet(element, attrName, value);
}
//# sourceMappingURL=processNameValueAttribute.function.js.map