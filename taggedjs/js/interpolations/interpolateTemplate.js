import { variablePrefix } from '../tag/Tag.class.js';
import { elementInitCheck } from './elementInitCheck.js';
import { processFirstSubjectValue } from '../tag/update/processFirstSubjectValue.function.js';
import { isTagArray, isTagComponent } from '../isInstance.js';
import { scanTextAreaValue } from './scanTextAreaValue.function.js';
import { updateExistingValue } from '../tag/update/updateExistingValue.function.js';
import { swapInsertBefore } from '../tag/setTagPlaceholder.function.js';
export function interpolateTemplate(insertBefore, // <template end interpolate /> (will be removed)
context, // variable scope of {`__tagvar${index}`:'x'}
ownerSupport, // Tag class
counts) {
    if (!insertBefore.hasAttribute('end')) {
        return; // only care about <template end>
    }
    const variableName = insertBefore.getAttribute('id');
    if (variableName?.substring(0, variablePrefix.length) !== variablePrefix) {
        return; // ignore, not a tagVar
    }
    const existingSubject = context[variableName];
    const isDynamic = isTagComponent(existingSubject._value) || isTagArray(existingSubject.value);
    // process dynamics later
    if (isDynamic) {
        return {
            variableName,
            ownerSupport,
            subject: existingSubject,
            insertBefore
        };
    }
    subscribeToTemplate(insertBefore, existingSubject, ownerSupport, counts);
    return;
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
/** This is the function that enhances elements such as [class.something] and [style.color] OR it fixes elements that alter innerHTML */
export function afterElmBuild(elm, options, context, ownerSupport) {
    if (!elm.getAttribute) {
        return;
    }
    // Elements that alter innerHTML
    const tagName = elm.nodeName; // elm.tagName
    if (tagName === 'TEXTAREA') {
        scanTextAreaValue(elm, context, ownerSupport);
    }
    let diff = options.counts.added;
    diff = elementInitCheck(elm, options.counts) - diff;
    const hasFocusFun = elm.focus;
    if (hasFocusFun) {
        if (elm.hasAttribute('autofocus')) {
            elm.focus();
        }
        if (elm.hasAttribute('autoselect')) {
            elm.select();
        }
    }
    const children = elm.children;
    if (children) {
        for (let index = children.length - 1; index >= 0; --index) {
            const child = children[index];
            const subOptions = {
                ...options,
                counts: options.counts,
            };
            afterElmBuild(child, subOptions, context, ownerSupport);
        }
    }
}
//# sourceMappingURL=interpolateTemplate.js.map