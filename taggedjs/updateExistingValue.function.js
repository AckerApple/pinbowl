import { isSubjectInstance, isTagArray, isTagComponent } from "./isInstance.js";
import { bindSubjectCallback } from "./bindSubjectCallback.function.js";
import { processTag } from "./processSubjectValue.function.js";
import { processTagArray } from "./processTagArray.js";
import { updateExistingTagComponent } from "./updateExistingTagComponent.function.js";
import { updateExistingTag } from "./updateExistingTag.function.js";
export function updateExistingValue(existing, value, tag) {
    const subjectValue = existing.value;
    const ogTag = subjectValue?.tag;
    const tempResult = value;
    const existingSubArray = existing;
    const existingSubTag = existing;
    // was array
    if (existingSubArray.lastArray) {
        // If we are working with tag component 2nd argument children, the value has to be digged
        if (existingSubArray.isChildSubject) {
            value = value.value; // A subject contains the value
        }
        // its another tag array
        if (isTagArray(value)) {
            processTagArray(existing, value, existingSubArray.template, tag, { counts: {
                    added: 0,
                    removed: 0,
                } });
            return;
        }
        // was tag array and now something else
        ;
        existing.lastArray.forEach(({ tag }) => tag.destroy());
        delete existing.lastArray;
    }
    // handle already seen tag components
    if (isTagComponent(tempResult)) {
        return updateExistingTagComponent(tag, tempResult, existingSubTag, subjectValue);
    }
    // was component but no longer
    const existingTag = existingSubTag.tag;
    if (existingTag) {
        // its now an array
        if (isTagArray(value)) {
            destroyTagMemory(existingTag, existingSubTag, subjectValue);
            delete existingSubTag.tag;
        }
        const oldWrapper = existingTag.tagSupport.templater.wrapper;
        const newWrapper = value?.wrapper;
        const wrapMatch = oldWrapper && newWrapper && oldWrapper?.original === newWrapper?.original;
        // TODO: We shouldn't need both of these
        const isSameTag = value && existingTag.lastTemplateString === value.lastTemplateString;
        const isSameTag2 = value && value.getTemplate && existingTag.isLikeTag(value);
        if (isSameTag || isSameTag2) {
            processTag(value, existing, existing.template, existingTag, // tag,
            {
                counts: {
                    added: 0,
                    removed: 0,
                }
            });
            return;
        }
        if (wrapMatch) {
            return updateExistingTag(value, existingTag, existingSubTag);
        }
        if (ogTag) {
            destroyTagMemory(existingTag, existingSubTag, subjectValue);
            delete existingSubTag.tag;
        }
    }
    // now its a function
    if (value instanceof Function) {
        existingSubTag.set(bindSubjectCallback(value, tag));
        return;
    }
    // we have been given a subject
    if (isSubjectInstance(value)) {
        existingSubTag.set(value.value); // let ValueSubject now of newest value
        return;
    }
    existingSubTag.set(value); // let ValueSubject now of newest value
    return;
}
export function destroyTagMemory(existingTag, existingSubject, subjectValue) {
    delete existingSubject.tag;
    delete existingSubject.tagSupport;
    delete subjectValue.tagSupport;
    existingTag.destroy();
}
//# sourceMappingURL=updateExistingValue.function.js.map