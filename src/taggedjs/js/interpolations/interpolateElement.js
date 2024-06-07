import { interpolateAttributes } from './interpolateAttributes.js';
import { interpolateToTemplates } from './interpolations.js';
import { interpolateContentTemplates } from './interpolateContentTemplates.js';
import { escapeSearch, variablePrefix } from '../tag/Tag.class.js';
/** Review elements within an element */
export function interpolateElement(container, // element containing innerHTML to review interpolations
context, // variables used to evaluate
interpolatedTemplates, ownerSupport, options) {
    const clones = [];
    const tagComponents = [];
    const result = interpolatedTemplates.interpolation;
    const template = container.children[0];
    const children = template.content.children;
    if (result.keys.length) {
        const { clones: nextClones, tagComponents: nextTagComponents } = interpolateContentTemplates(context, ownerSupport, options, children);
        clones.push(...nextClones);
        tagComponents.push(...nextTagComponents);
    }
    interpolateAttributes(template, context, ownerSupport);
    processChildrenAttributes(children, context, ownerSupport);
    return { clones, tagComponents };
}
function processChildrenAttributes(children, context, ownerSupport) {
    for (let index = children.length - 1; index >= 0; --index) {
        const child = children[index];
        interpolateAttributes(child, context, ownerSupport);
        if (child.children) {
            processChildrenAttributes(child.children, context, ownerSupport);
        }
    }
}
export function interpolateString(string) {
    const result = interpolateToTemplates(string);
    result.string = result.string.replace(escapeSearch, variablePrefix);
    return result;
}
//# sourceMappingURL=interpolateElement.js.map