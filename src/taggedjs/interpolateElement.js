import { interpolateAttributes } from "./interpolateAttributes.js";
import { interpolateToTemplates } from "./interpolations.js";
import { interpolateContentTemplates } from "./interpolateContentTemplates.js";
import { escapeSearch, variablePrefix } from "./Tag.class.js";
export function interpolateElement(element, context, // variables used to evaluate
interpolatedTemplates, tagOwner, options) {
    const clones = [];
    const result = interpolatedTemplates.interpolation; // interpolateElementChild(element)
    // const result = interpolateElementChild(element)
    const template = element.children[0];
    const children = template.content.children;
    if (result.keys.length) {
        const nextClones = interpolateContentTemplates(element, context, tagOwner, options, children);
        clones.push(...nextClones);
    }
    interpolateAttributes(element, context, tagOwner);
    processChildrenAttributes(children, context, tagOwner);
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
function interpolateElementChild(child) {
    const result = interpolateString(child.innerHTML);
    child.innerHTML = result.string;
    return result;
}
export function interpolateString(string) {
    const result = interpolateToTemplates(string);
    result.string = result.string.replace(escapeSearch, variablePrefix);
    return result;
}
//# sourceMappingURL=interpolateElement.js.map