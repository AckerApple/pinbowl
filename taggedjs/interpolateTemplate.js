import { variablePrefix } from "./Tag.class.js";
import { elementInitCheck } from "./elementInitCheck.js";
import { processSubjectValue } from "./processSubjectValue.function.js";
export function interpolateTemplate(template, // <template end interpolate /> (will be removed)
context, // variable scope of {`__tagvar${index}`:'x'}
tag, // Tag class
counts, // used for animation stagger computing
options) {
    const clones = [];
    if (!template.hasAttribute('end')) {
        return clones; // only care about starts
    }
    const variableName = template.getAttribute('id');
    if (variableName?.substring(0, variablePrefix.length) !== variablePrefix) {
        return clones; // ignore, not a tagVar
    }
    const result = context[variableName];
    let isForceElement = options.forceElement;
    const callback = (templateNewValue) => {
        const { clones } = processSubjectValue(templateNewValue, result, template, tag, {
            // counts,
            counts: { added: counts.added, removed: counts.removed },
            forceElement: isForceElement,
        });
        if (isForceElement) {
            isForceElement = false; // only can happen once
        }
        clones.push(...clones);
    };
    const sub = result.subscribe(callback);
    tag.cloneSubs.push(sub);
    return clones;
}
// Function to update the value of x
export function updateBetweenTemplates(value, lastFirstChild) {
    const parent = lastFirstChild.parentNode;
    // mimic React skipping to display EXCEPT for true does display on page
    if (value === undefined || value === false || value === null) { // || value === true
        value = '';
    }
    // Insert the new value (never use innerHTML here)
    const textNode = document.createTextNode(value); // never innerHTML
    parent.insertBefore(textNode, lastFirstChild);
    /* remove existing nodes */
    parent.removeChild(lastFirstChild);
    return textNode;
}
export function afterElmBuild(elm, options) {
    if (!elm.getAttribute) {
        return;
    }
    let diff = options.counts.added;
    if (!options.forceElement) {
        diff = elementInitCheck(elm, options.counts) - diff;
    }
    if (elm.children) {
        const subCounts = {
            added: options.counts.added, // - diff,
            removed: options.counts.removed,
        };
        new Array(...elm.children).forEach((child, index) => {
            return afterElmBuild(child, {
                ...options,
                counts: options.counts,
            });
        });
    }
}
//# sourceMappingURL=interpolateTemplate.js.map