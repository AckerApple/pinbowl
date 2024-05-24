import { isStaticTag } from '../isInstance';
import { ValueTypes, getValueType } from './update/processFirstSubject.utils';
import { isLikeTags } from './isLikeTags.function';
import { destroyTagMemory, destroyTagSupportPast } from './destroyTag.function';
import { insertAfter } from '../insertAfter.function';
export function checkDestroyPrevious(subject, // existing.value is the old value
newValue, insertBefore) {
    const displaySubject = subject;
    const hasLastValue = 'lastValue' in displaySubject;
    const lastValue = displaySubject.lastValue; // TODO: we maybe able to use displaySubject.value and remove concept of lastValue
    // was simple value but now something bigger
    if (hasLastValue && lastValue !== newValue) {
        // below is faster than using getValueType
        const newType = typeof (newValue);
        if (isSimpleType(newType) && typeof (lastValue) === newType) {
            return false;
        }
        if (newValue instanceof Function && lastValue instanceof Function) {
            return false;
        }
        destroySimpleValue(insertBefore, displaySubject);
        return 'changed-simple-value';
    }
    const valueType = getValueType(newValue);
    const arraySubject = subject;
    const wasArray = arraySubject.lastArray;
    // no longer an array
    if (wasArray && valueType !== ValueTypes.tagArray) {
        const placeholderElm = arraySubject.placeholder;
        delete arraySubject.lastArray;
        delete arraySubject.placeholder;
        insertAfter(insertBefore, placeholderElm);
        for (let index = wasArray.length - 1; index >= 0; --index) {
            const { tagSupport } = wasArray[index];
            destroyArrayTag(tagSupport, { added: 0, removed: 0 });
        }
        return 'array';
    }
    const tagSubject = subject;
    const lastSupport = tagSubject.tagSupport;
    // no longer tag or component?
    if (lastSupport) {
        const isValueTag = isStaticTag(newValue);
        const isSubjectTag = isStaticTag(subject.value);
        if (isSubjectTag && isValueTag) {
            const newTag = newValue;
            // its a different tag now
            if (!isLikeTags(newTag, lastSupport)) {
                // put template back down
                restoreTagMarker(lastSupport);
                destroyTagMemory(lastSupport);
                return 2;
            }
            return false;
        }
        if (valueType === ValueTypes.tagComponent) {
            return false; // its still a tag component
        }
        if (newValue && newValue.oneRender) {
            return false;
        }
        // put template back down
        restoreTagMarker(lastSupport);
        // destroy old component, value is not a component
        destroyTagMemory(lastSupport);
        return 'different-tag';
    }
    return false;
}
export function isSimpleType(value) {
    return ['string', 'number', 'boolean'].includes(value);
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
export function restoreTagMarker(lastSupport) {
    const insertBefore = lastSupport.global.insertBefore;
    const global = lastSupport.global;
    const placeholderElm = global.placeholder;
    if (placeholderElm) {
        insertAfter(insertBefore, placeholderElm);
        delete global.placeholder;
    }
}
//# sourceMappingURL=checkDestroyPrevious.function.js.map