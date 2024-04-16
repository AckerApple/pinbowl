import { variablePrefix } from "./Tag.class";
import { elementInitCheck } from "./elementInitCheck";
import { processSubjectValue } from "./processSubjectValue.function";
import { isTagArray, isTagComponent } from "./isInstance";
import { scanTextAreaValue } from "./scanTextAreaValue.function";
import { updateExistingValue } from "./updateExistingValue.function";
export function interpolateTemplate(insertBefore, // <template end interpolate /> (will be removed)
context, // variable scope of {`__tagvar${index}`:'x'}
ownerTag, // Tag class
counts, // used for animation stagger computing
options) {
    // TODO: THe clones array is useless here
    const clones = [];
    if (!insertBefore.hasAttribute('end')) {
        return { clones }; // only care about <template end>
    }
    const variableName = insertBefore.getAttribute('id');
    if (variableName?.substring(0, variablePrefix.length) !== variablePrefix) {
        return { clones }; // ignore, not a tagVar
    }
    const existingSubject = context[variableName];
    const isDynamic = isTagComponent(existingSubject.value) || isTagArray(existingSubject.value);
    // process dynamics later
    if (isDynamic) {
        return {
            clones,
            tagComponent: {
                variableName,
                ownerTag,
                subject: existingSubject,
                insertBefore
            }
        };
    }
    let isForceElement = options.forceElement;
    subscribeToTemplate(insertBefore, existingSubject, ownerTag, counts, { isForceElement });
    return { clones };
}
export function subscribeToTemplate(insertBefore, subject, ownerTag, counts, // used for animation stagger computing
{ isForceElement }) {
    let called = false;
    const callback = (value) => {
        // const orgInsert = insertBefore
        /*
        const clone = (subject as DisplaySubject).clone
        if(clone && clone.parentNode) {
          insertBefore = clone
        }
        */
        if (called) {
            updateExistingValue(subject, value, ownerTag, insertBefore);
            return;
        }
        if (!insertBefore.parentNode) {
            throw new Error('no insert before parent node - 3');
        }
        processSubjectValue(value, subject, insertBefore, ownerTag, {
            counts: { ...counts },
            forceElement: isForceElement,
        });
        if (isForceElement) {
            isForceElement = false; // only can happen once
        }
        // ownerTag.clones.push(...clones)
        // ownerTag.clones.push(...nextClones)
        // clones.push(...nextClones)
        called = true;
    };
    const sub = subject.subscribe(callback);
    ownerTag.tagSupport.templater.global.subscriptions.push(sub);
}
export function afterElmBuild(elm, options, context, ownerTag) {
    if (!elm.getAttribute) {
        return;
    }
    const tagName = elm.nodeName; // elm.tagName
    if (tagName === 'TEXTAREA') {
        scanTextAreaValue(elm, context, ownerTag);
    }
    let diff = options.counts.added;
    diff = elementInitCheck(elm, options.counts) - diff;
    if (elm.children) {
        new Array(...elm.children).forEach((child, index) => {
            const subOptions = {
                ...options,
                counts: options.counts,
            };
            return afterElmBuild(child, subOptions, context, ownerTag);
        });
    }
}
//# sourceMappingURL=interpolateTemplate.js.map