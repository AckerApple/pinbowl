import { interpolateAttributes } from "./interpolateAttributes";
import { interpolateToTemplates } from "./interpolations";
import { interpolateContentTemplates } from "./interpolateContentTemplates";
import { escapeSearch, variablePrefix } from "./Tag.class";
/** Review elements within an element */
export function interpolateElement(container, // element containing innerHTML to review interpolations
context, // variables used to evaluate
interpolatedTemplates, tagOwner, options) {
    const clones = [];
    const tagComponents = [];
    const result = interpolatedTemplates.interpolation;
    const template = container.children[0];
    const children = template.content.children;
    if (result.keys.length) {
        const { clones: nextClones, tagComponents: nextTagComponents } = interpolateContentTemplates(container, context, tagOwner, options, children);
        clones.push(...nextClones);
        tagComponents.push(...nextTagComponents);
    }
    interpolateAttributes(container, context, tagOwner);
    processChildrenAttributes(children, context, tagOwner);
    return { clones, tagComponents };
}
function processChildrenAttributes(children, context, ownerTag) {
    new Array(...children).forEach(child => {
        interpolateAttributes(child, context, ownerTag);
        if (child.children) {
            processChildrenAttributes(child.children, context, ownerTag);
        }
    });
}
export function interpolateString(string) {
    const result = interpolateToTemplates(string);
    result.string = result.string.replace(escapeSearch, variablePrefix);
    return result;
}
//# sourceMappingURL=interpolateElement.js.map