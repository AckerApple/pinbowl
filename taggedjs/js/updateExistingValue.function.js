import { TagSupport } from './TagSupport.class';
import { isSubjectInstance, isTagArray, isTagComponent, isTagInstance } from './isInstance';
import { processTagArray } from './processTagArray';
import { updateExistingTagComponent } from './updateExistingTagComponent.function';
import { processRegularValue } from './processRegularValue.function';
import { checkDestroyPrevious } from './checkDestroyPrevious.function';
import { processSubjectComponent } from './processSubjectComponent.function';
import { isLikeTags } from './isLikeTags.function';
import { bindSubjectCallback } from './bindSubjectCallback.function';
import { applyFakeTemplater, processTag } from './processTag.function';
import { insertAfter } from './insertAfter.function';
export function updateExistingValue(subject, value, ownerTag, insertBefore) {
    const subjectTag = subject;
    const isComponent = isTagComponent(value);
    // const global = subjectTag.tag?.tagSupport.templater.global
    // const placeholderElm = global?.placeholderElm || global?.insertBefore || (subject as DisplaySubject).insertBefore
    // const oldInsertBefore = placeholderElm || (subject as DisplaySubject).clone
    const destroyType = checkDestroyPrevious(subject, value, insertBefore);
    // handle already seen tag components
    if (isComponent) {
        const templater = value;
        // When was something before component
        if (!subjectTag.tag) {
            const tag = processSubjectComponent(templater, subjectTag, insertBefore, // oldInsertBefore as InsertBefore,
            ownerTag, {
                forceElement: true,
                counts: { added: 0, removed: 0 },
            });
            return subjectTag;
        }
        // ??? - new put back down template tag before redraw
        const placeholderElm = subjectTag.tag.tagSupport.templater.global.placeholderElm;
        if (placeholderElm) {
            insertAfter(insertBefore, placeholderElm);
            delete subjectTag.tag.tagSupport.templater.global.placeholderElm;
        }
        templater.tagSupport = new TagSupport(
        // subjectTag.tag.tagSupport.ownerTagSupport,
        ownerTag.tagSupport, templater, subjectTag);
        const tag = updateExistingTagComponent(ownerTag, templater, // latest value
        subjectTag, insertBefore);
        if (insertBefore.parentNode) {
            tag.tagSupport.templater.global.placeholderElm = insertBefore.previousSibling;
            insertBefore.parentNode.removeChild(insertBefore);
        }
        return subjectTag;
    }
    // was component but no longer
    const tag = subjectTag.tag;
    if (tag) {
        handleStillTag(tag, subject, value, ownerTag);
        return subjectTag;
    }
    // its another tag array
    if (isTagArray(value)) {
        processTagArray(subject, value, insertBefore, // oldInsertBefore as InsertBefore,
        ownerTag, { counts: {
                added: 0,
                removed: 0,
            } });
        return subject;
    }
    // now its a function
    if (value instanceof Function) {
        // const newSubject = getSubjectFunction(value, ownerTag)
        const bound = bindSubjectCallback(value, ownerTag);
        subject.set(bound);
        return subject;
    }
    if (isTagInstance(value)) {
        if (insertBefore.tagName !== 'TEMPLATE') {
            throw new Error(`expected template - ${insertBefore.nodeName}`);
        }
        processTag(value, subjectTag, insertBefore, ownerTag);
        return subjectTag;
    }
    // we have been given a subject
    if (isSubjectInstance(value)) {
        return value;
    }
    // This will cause all other values to render
    processRegularValue(value, subject, 
    // ??? - changed to insertBefore for tag switching with template removal
    insertBefore // oldInsertBefore as InsertBefore,
    );
    return subjectTag;
}
function handleStillTag(existingTag, subject, value, ownerTag) {
    // TODO: We shouldn't need both of these
    const isSameTag = value && isLikeTags(existingTag, value);
    const isSameTag2 = value && value.getTemplate && existingTag.isLikeTag(value);
    const tag = value;
    if (!tag.tagSupport) {
        applyFakeTemplater(tag, ownerTag, subject);
    }
    if (isSameTag) {
        existingTag.updateByTag(tag);
        return;
    }
    if (isSameTag || isSameTag2) {
        const subjectTag = subject;
        const global = existingTag.tagSupport.templater.global;
        delete global.placeholderElm;
        const insertBefore = global.insertBefore;
        return processTag(value, subjectTag, insertBefore, ownerTag);
    }
    return processRegularValue(value, subject, subject.insertBefore);
}
//# sourceMappingURL=updateExistingValue.function.js.map