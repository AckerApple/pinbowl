import { setValueRedraw } from "./Tag.utils.js";
import { deepClone } from "./deepFunctions.js";
import { isSubjectInstance, isTagComponent, isTagInstance } from "./isInstance.js";
import { bindSubjectCallback } from "./bindSubjectCallback.function.js";
import { isTagArray, processTag } from "./processSubjectValue.function.js";
import { processTagArray } from "./processTagArray.js";
function updateExistingTagComponent(tag, tempResult, existingSubject, subjectValue) {
    const latestProps = tempResult.tagSupport.props;
    let existingTag = existingSubject.tag;
    // previously was something else, now a tag component
    if (!existingTag) {
        setValueRedraw(tempResult, existingSubject, tag);
        tempResult.redraw();
        return;
    }
    // tag existingTag
    const oldWrapper = existingTag.tagSupport.templater.wrapper;
    const newWrapper = tempResult.wrapper;
    let isSameTag = false;
    if (oldWrapper && newWrapper) {
        const oldFunction = oldWrapper.original;
        const newFunction = newWrapper.original;
        isSameTag = oldFunction === newFunction;
    }
    const oldTagSetup = existingTag.tagSupport;
    oldTagSetup.latestProps = latestProps;
    // oldTagSetup.latestClonedProps = tempResult.tagSupport.clonedProps
    oldTagSetup.latestClonedProps = tempResult.tagSupport.latestClonedProps;
    if (!isSameTag) {
        // TODO: this may not be in use
        destroyTagMemory(existingTag, existingSubject, subjectValue);
    }
    else {
        const subjectTagSupport = subjectValue?.tagSupport;
        // old props may have changed, reclone first
        let oldCloneProps = subjectTagSupport.props;
        // if the new props are NOT HTML children, then clone the props for later render cycle comparing
        if (!isTagInstance(subjectTagSupport.props)) {
            oldCloneProps = deepClone(subjectTagSupport.props); // tagSupport.clonedProps
        }
        const oldProps = subjectTagSupport?.props; // tagSupport.props
        if (existingTag) {
            const equal = oldTagSetup.hasPropChanges(oldProps, oldCloneProps, latestProps);
            console.log('xxxxx', equal);
            if (equal) {
                return;
            }
        }
    }
    setValueRedraw(tempResult, existingSubject, tag);
    oldTagSetup.templater = tempResult;
    const redraw = tempResult.redraw();
    existingSubject.value.tag = oldTagSetup.newest = redraw;
    if (!isSameTag) {
        existingSubject.tag = redraw;
        subjectValue.tagSupport = tempResult.tagSupport;
    }
    return;
}
function updateExistingTag(templater, ogTag, existingSubject) {
    const tagSupport = ogTag.tagSupport;
    const oldest = tagSupport.oldest;
    oldest.beforeRedraw();
    const retag = templater.wrapper();
    // move my props onto tagSupport
    tagSupport.latestProps = retag.tagSupport.props;
    // tagSupport.latestClonedProps = retag.tagSupport.clonedProps
    tagSupport.latestClonedProps = retag.tagSupport.latestClonedProps;
    tagSupport.memory = retag.tagSupport.memory;
    retag.setSupport(tagSupport);
    templater.newest = retag;
    tagSupport.newest = retag;
    oldest.afterRender();
    ogTag.updateByTag(retag);
    existingSubject.set(templater);
    return;
}
export function updateExistingValue(existing, value, tag) {
    const subjectValue = existing.value;
    const ogTag = subjectValue?.tag;
    const tempResult = value;
    const existingSubArray = existing;
    const existingSubTag = existing;
    // was array
    if (existing.lastArray) {
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
function destroyTagMemory(existingTag, existingSubject, subjectValue) {
    delete existingSubject.tag;
    delete existingSubject.tagSupport;
    delete subjectValue.tagSupport;
    existingTag.destroy();
}
//# sourceMappingURL=updateTag.utils.js.map