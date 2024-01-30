import { interpolateAttributes } from "./interpolateAttributes.js";
import { interpolateToTemplates } from "./interpolations.js";
import { interpolateContentTemplates } from "./interpolateContentTemplates.js";
import { escapeSearch, variablePrefix } from "./Tag.class.js";
export function interpolateElement(element, context, // variables used to evaluate
ownerTag, options) {
    const result = interpolateElementChild(element);
    if (result.keys.length) {
        interpolateContentTemplates(element, context, ownerTag, options);
    }
    interpolateAttributes(element, context, ownerTag);
    processChildrenAttributes(element.children, context, ownerTag);
}
function processChildrenAttributes(children, context, ownerTag) {
    new Array(...children).forEach(child => {
        interpolateAttributes(child, context, ownerTag);
        if (child.children) {
            processChildrenAttributes(child.children, context, ownerTag);
        }
    });
}
/** Convert interpolations into template tags */
function interpolateElementChild(child) {
    const result = interpolateToTemplates(child.innerHTML);
    result.string = result.string.replace(escapeSearch, variablePrefix);
    child.innerHTML = result.string;
    return result;
}
//# sourceMappingURL=interpolateElement.js.map