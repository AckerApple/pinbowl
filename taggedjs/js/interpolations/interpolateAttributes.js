import { processAttribute } from './processAttribute.function.js';
function howToSetAttribute(element, name, value) {
    element.setAttribute(name, value);
}
export function howToSetInputValue(element, name, value) {
    element.setAttribute(name, value);
}
export function interpolateAttributes(element, scope, ownerSupport) {
    const attrNames = element.getAttributeNames();
    let howToSet = howToSetAttribute;
    for (let index = 0; index < attrNames.length; ++index) {
        const attrName = attrNames[index];
        const value = element.getAttribute(attrName);
        processAttribute([attrName, value], element, scope, ownerSupport, howToSet);
    }
}
//# sourceMappingURL=interpolateAttributes.js.map