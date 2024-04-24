import { isTag, isTagArray, isTagComponent } from './isInstance';
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
        wasArray.forEach(({ tagSupport }) => destroyArrayTag(tagSupport, { added: 0, removed: 0 }));
        return 'array';
    }
    const tagSubject = subject;
    const lastSupport = tagSubject.tagSupport;
    // no longer tag or component?
    if (lastSupport) {
        const isValueTag = isTag(newValue);
        const isSubjectTag = isTag(subject.value);
        if (isSubjectTag && isValueTag) {
            const newTag = newValue;
            // its a different tag now
            if (!isLikeTags(newTag, lastSupport)) {
                // put template back down
                restoreTagMarker(lastSupport, insertBefore);
                destroyTagMemory(lastSupport, tagSubject);
                return 2;
            }
            return false;
        }
        const isValueTagComponent = isTagComponent(newValue);
        if (isValueTagComponent) {
            return false; // its still a tag component
        }
        // put template back down
        restoreTagMarker(lastSupport, insertBefore);
        // destroy old component, value is not a component
        destroyTagMemory(lastSupport, tagSubject);
        return 'different-tag';
    }
    const displaySubject = subject;
    const hasLastValue = 'lastValue' in displaySubject;
    const lastValue = displaySubject.lastValue; // TODO: we maybe able to use displaySubject.value and remove concept of lastValue
    // was simple value but now something bigger
    if (hasLastValue && lastValue !== newValue) {
        destroySimpleValue(insertBefore, displaySubject);
        return 'changed-simple-value';
    }
    return false;
}
export function destroyArrayTag(tagSupport, counts) {
    destroyTagSupportPast(tagSupport);
    tagSupport.destroy({
        stagger: counts.removed++,
    });
    const insertBefore = tagSupport.global.insertBefore;
    const parentNode = insertBefore.parentNode;
    parentNode.removeChild(insertBefore);
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
export function restoreTagMarker(lastSupport, insertBefore) {
    const global = lastSupport.global;
    const placeholderElm = global.placeholder;
    if (placeholderElm) {
        insertAfter(insertBefore, placeholderElm);
    }
}
//# sourceMappingURL=checkDestroyPrevious.function.js.map