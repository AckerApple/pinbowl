import { variablePrefix } from "./Tag.class.js";
import { elementInitCheck } from "./elementInitCheck.js";
import { processSubjectValue } from "./processSubjectValue.function.js";
export function interpolateTemplate(template, // <template end interpolate /> (will be removed)
context, // variable scope of {`__tagvar${index}`:'x'}
tag, // Tag class
counts, // {added:0, removed:0}
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
    // const isSubject = isSubjectInstance(result)
    let isForceElement = options.forceElement;
    const callback = (templateNewValue) => {
        const { clones } = processSubjectValue(templateNewValue, result, template, tag, { counts, forceElement: isForceElement });
        if (isForceElement) {
            isForceElement = false; // only can happen once
        }
        clones.push(...clones);
        // TODO: See if we can remove
        setTimeout(() => {
            counts.added = 0; // reset
            counts.removed = 0; // reset
        }, 0);
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
    if (lastFirstChild.nodeName === 'TEMPLATE') {
        lastFirstChild.setAttribute('removedAt', Date.now().toString());
    }
    return textNode;
}
export function afterElmBuild(elm, options) {
    if (!elm.getAttribute) {
        return;
    }
    if (!options.forceElement) {
        elementInitCheck(elm, options.counts);
    }
    if (elm.children) {
        new Array(...elm.children).forEach(child => afterElmBuild(child, options));
    }
}
//# sourceMappingURL=interpolateTemplate.js.map