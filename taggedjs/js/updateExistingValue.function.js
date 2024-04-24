import { TagSupport } from './TagSupport.class';
import { TemplaterResult } from './TemplaterResult.class';
import { isSubjectInstance, isTagArray, isTagClass, isTagComponent, isTagTemplater } from './isInstance';
import { processTagArray } from './processTagArray';
import { updateExistingTagComponent } from './updateExistingTagComponent.function';
import { processRegularValue } from './processRegularValue.function';
import { checkDestroyPrevious } from './checkDestroyPrevious.function';
import { ValueSubject } from './subject/ValueSubject';
import { processSubjectComponent } from './processSubjectComponent.function';
import { isLikeTags } from './isLikeTags.function';
import { bindSubjectCallback } from './interpolations/bindSubjectCallback.function';
import { setupNewTemplater, getFakeTemplater, processTag } from './processTag.function';
import { insertAfter } from './insertAfter.function';
export function updateExistingValue(subject, value, ownerSupport, insertBefore) {
    const subjectTag = subject;
    const isComponent = isTagComponent(value);
    checkDestroyPrevious(subject, value, insertBefore);
    // handle already seen tag components
    if (isComponent) {
        return prepareUpdateToComponent(value, subjectTag, insertBefore, ownerSupport);
    }
    // was component but no longer
    const tagSupport = subjectTag.tagSupport;
    if (tagSupport) {
        handleStillTag(subject, value, ownerSupport);
        return subjectTag;
    }
    // its another tag array
    if (isTagArray(value)) {
        processTagArray(subject, value, insertBefore, // oldInsertBefore as InsertBefore,
        ownerSupport, { counts: {
                added: 0,
                removed: 0,
            } });
        return subject;
    }
    if (isTagTemplater(value)) {
        processTag(value, insertBefore, ownerSupport, subjectTag);
        return subjectTag;
    }
    if (isTagClass(value)) {
        const tag = value;
        let templater = tag.templater;
        if (!templater) {
            templater = getFakeTemplater();
            tag.templater = templater;
            templater.tag = tag;
        }
        processTag(templater, insertBefore, ownerSupport, subjectTag);
        return subjectTag;
    }
    // we have been given a subject
    if (isSubjectInstance(value)) {
        return value;
    }
    // now its a function
    if (value instanceof Function) {
        const bound = bindSubjectCallback(value, ownerSupport);
        subject.set(bound);
        return subject;
    }
    // This will cause all other values to render
    processRegularValue(value, subject, insertBefore);
    return subjectTag;
}
function handleStillTag(subject, value, ownerSupport) {
    const lastSupport = subject.tagSupport;
    let templater = value;
    const isClass = isTagClass(value);
    if (isClass) {
        const tag = value;
        templater = tag.templater;
        if (!templater) {
            const children = new ValueSubject([]);
            templater = new TemplaterResult(undefined, children);
            templater.tag = tag;
            tag.templater = templater;
        }
    }
    const valueSupport = new TagSupport(templater, ownerSupport, subject);
    if (isClass) {
        valueSupport.global = lastSupport.global;
    }
    const isSameTag = value && isLikeTags(lastSupport, valueSupport);
    if (isTagTemplater(value)) {
        setupNewTemplater(valueSupport, ownerSupport, subject);
    }
    if (isSameTag) {
        lastSupport.updateBy(valueSupport);
        return;
    }
    if (isSameTag) {
        // const subjectTag = subject as TagSubject
        const global = lastSupport.global;
        const insertBefore = global.insertBefore;
        return processTag(templater, insertBefore, ownerSupport, subject);
    }
    return processRegularValue(value, subject, subject.insertBefore);
}
function prepareUpdateToComponent(templater, subjectTag, insertBefore, ownerSupport) {
    // When was something before component
    if (!subjectTag.tagSupport) {
        processSubjectComponent(templater, subjectTag, insertBefore, // oldInsertBefore as InsertBefore,
        ownerSupport, {
            forceElement: true,
            counts: { added: 0, removed: 0 },
        });
        return subjectTag;
    }
    const tagSupport = new TagSupport(templater, ownerSupport, subjectTag);
    // ??? new mirroring
    const subjectSup = subjectTag.tagSupport;
    // const prevSupport = (subjectSup.global.newest || subjectSup) as TagSupport
    const prevSupport = subjectSup.global.newest;
    if (prevSupport) {
        const newestState = prevSupport.memory.state;
        tagSupport.memory.state = [...newestState];
    }
    else {
        const placeholder = subjectSup.global.placeholder;
        if (placeholder && !insertBefore.parentNode) {
            insertAfter(insertBefore, placeholder);
            delete subjectSup.global.placeholder;
        }
        // insertBefore = subjectSup.global.placeholder || insertBefore
        processSubjectComponent(templater, subjectTag, insertBefore, ownerSupport, {
            forceElement: true,
            counts: { added: 0, removed: 0 },
        });
        return subjectTag;
    }
    tagSupport.global = subjectSup.global;
    subjectTag.tagSupport = tagSupport;
    updateExistingTagComponent(ownerSupport, tagSupport, // latest value
    subjectTag, insertBefore);
    return subjectTag;
}
//# sourceMappingURL=updateExistingValue.function.js.map