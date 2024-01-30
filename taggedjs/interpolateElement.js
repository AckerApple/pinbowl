import { interpolateAttributes } from "./interpolateAttributes.js";
import { interpolateToTemplates } from "./interpolations.js";
import { interpolateContentTemplates } from "./interpolateContentTemplates.js";
import { escapeSearch, variablePrefix } from "./Tag.class.js";
export function interpolateElement(element, context, // variables used to evaluate
tag, options) {
    const clones = [];
    const result = interpolateElementChild(element, options.depth + 1);
    if (result.keys.length) {
        const nextClones = interpolateContentTemplates(element, context, tag, options);
        clones.push(...nextClones);
    }
    interpolateAttributes(element, context, tag);
    processChildrenAttributes(element.children, context, tag);
    return clones;
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
function interpolateElementChild(child, depth) {
    const result = interpolateToTemplates(child.innerHTML, { depth });
    result.string = result.string.replace(escapeSearch, variablePrefix);
    child.innerHTML = result.string;
    return result;
}
//# sourceMappingURL=interpolateElement.js.map