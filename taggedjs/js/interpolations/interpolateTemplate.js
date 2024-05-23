import { variablePrefix } from "../tag/Tag.class";
import { elementInitCheck } from "./elementInitCheck";
import { processFirstSubjectValue } from "../tag/update/processFirstSubjectValue.function";
import { isTagArray, isTagComponent } from "../isInstance";
import { scanTextAreaValue } from "./scanTextAreaValue.function";
import { updateExistingValue } from "../tag/update/updateExistingValue.function";
import { swapInsertBefore } from "../tag/setTagPlaceholder.function";
export function interpolateTemplate(insertBefore, // <template end interpolate /> (will be removed)
context, // variable scope of {`__tagvar${index}`:'x'}
ownerSupport, // Tag class
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
                ownerSupport,
                subject: existingSubject,
                insertBefore
            }
        };
    }
    subscribeToTemplate(insertBefore, existingSubject, ownerSupport, counts);
    return { clones };
}
export function subscribeToTemplate(insertBefore, subject, ownerSupport, counts) {
    let called = false;
    const onValue = (value) => {
        if (called) {
            updateExistingValue(subject, value, ownerSupport, insertBefore);
            return;
        }
        const templater = value;
        processFirstSubjectValue(templater, subject, insertBefore, ownerSupport, {
            counts: { ...counts },
        });
        called = true;
    };
    let mutatingCallback = onValue;
    const callback = (value) => mutatingCallback(value);
    const sub = subject.subscribe(callback);
    // on subscribe, the Subject did NOT emit immediately. Lets pull the template off the document
    if (insertBefore.parentNode) {
        const clone = subject.clone = swapInsertBefore(insertBefore);
        mutatingCallback = v => {
            const parentNode = clone.parentNode;
            parentNode.insertBefore(insertBefore, clone);
            parentNode.removeChild(clone);
            delete subject.clone;
            mutatingCallback = onValue; // all future calls will just produce value
            onValue(v); // calls for rending
        };
    }
    ownerSupport.global.subscriptions.push(sub);
}
export function afterElmBuild(elm, options, context, ownerSupport) {
    if (!elm.getAttribute) {
        return;
    }
    const tagName = elm.nodeName; // elm.tagName
    if (tagName === 'TEXTAREA') {
        scanTextAreaValue(elm, context, ownerSupport);
    }
    let diff = options.counts.added;
    diff = elementInitCheck(elm, options.counts) - diff;
    if (elm.children) {
        const children = elm.children;
        for (let index = children.length - 1; index >= 0; --index) {
            const child = children[index];
            const subOptions = {
                ...options,
                counts: options.counts,
            };
            return afterElmBuild(child, subOptions, context, ownerSupport);
        }
    }
}
//# sourceMappingURL=interpolateTemplate.js.map