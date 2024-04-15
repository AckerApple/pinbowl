import { isTagArray, isTagComponent, isTagInstance } from './isInstance';
import { isLikeTags } from './isLikeTags.function';
import { destroyTagMemory, destroyTagSupportPast } from './destroyTag.function';
import { insertAfter } from './insertAfter.function';
export function checkDestroyPrevious(subject, // existing.value is the old value
newValue, insertBefore) {
    const arraySubject = subject;
    const wasArray = arraySubject.lastArray;
    // no longer an array
    if (wasArray && !isTagArray(newValue)) {
        const placeholderElm = arraySubject.placeholder;
        delete arraySubject.lastArray;
        delete arraySubject.placeholder;
        insertAfter(insertBefore, placeholderElm);
        wasArray.forEach(({ tag }) => destroyArrayTag(tag, { added: 0, removed: 0 }));
        return 'array';
    }
    const tagSubject = subject;
    const existingTag = tagSubject.tag;
    // no longer tag or component?
    if (existingTag) {
        const isValueTag = isTagInstance(newValue);
        const isSubjectTag = isTagInstance(subject.value);
        if (isSubjectTag && isValueTag) {
            const newTag = newValue;
            // its a different tag now
            if (!isLikeTags(newTag, existingTag)) {
                // put template back down
                restoreTagMarker(existingTag, insertBefore);
                destroyTagMemory(existingTag, tagSubject);
                return 2;
            }
            return false;
        }
        const isValueTagComponent = isTagComponent(newValue);
        if (isValueTagComponent) {
            return false; // its still a tag component
        }
        // put template back down
        restoreTagMarker(existingTag, insertBefore);
        // destroy old component, value is not a component
        destroyTagMemory(existingTag, tagSubject);
        return 'different-tag';
    }
    const displaySubject = subject;
    const hasLastValue = 'lastValue' in displaySubject;
    const lastValue = displaySubject.lastValue; // TODO: we maybe able to use displaySubject.value and remove concept of lastValue
    // was simple value but now something bigger
    if (hasLastValue && lastValue !== newValue) {
        destroySimpleValue(insertBefore, displaySubject);
        return 4;
    }
    return false;
}
export function destroyArrayTag(tag, counts) {
    destroyTagSupportPast(tag.tagSupport);
    tag.destroy({
        stagger: counts.removed++,
    });
}
function destroySimpleValue(insertBefore, // always a template tag
subject) {
    const clone = subject.clone;
    const parent = clone.parentNode;
    // 1 put the template back down
    parent.insertBefore(insertBefore, clone);
    parent.removeChild(clone);
    delete subject.clone;
    delete subject.lastValue;
}
export function restoreTagMarker(existingTag, insertBefore) {
    const global = existingTag.tagSupport.templater.global;
    const placeholderElm = global.placeholder;
    if (placeholderElm) {
        insertAfter(insertBefore, placeholderElm);
    }
}
//# sourceMappingURL=checkDestroyPrevious.function.js.map