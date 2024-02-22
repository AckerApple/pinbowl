import { setValueRedraw } from "./Tag.utils.js";
import { deepClone } from "./deepFunctions.js";
import { isTagInstance } from "./isInstance.js";
import { destroyTagMemory } from "./updateExistingValue.function.js";
import { hasTagSupportChanged } from "./TagSupport.class.js";
export function updateExistingTagComponent(tag, tempResult, existingSubject, subjectValue) {
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
    const latestProps = tempResult.tagSupport.props;
    const oldTagSetup = existingTag.tagSupport;
    oldTagSetup.latestProps = latestProps;
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
            oldCloneProps = deepClone(subjectTagSupport.props);
        }
        if (existingTag) {
            const hasChanged = hasTagSupportChanged(oldTagSetup, tempResult.tagSupport);
            if (!hasChanged) {
                return;
            }
        }
    }
    setValueRedraw(tempResult, existingSubject, tag);
    oldTagSetup.templater = tempResult;
    const redraw = tempResult.redraw();
    existingSubject.value.tag = oldTagSetup.newest = redraw;
    oldTagSetup.latestClonedProps = tempResult.tagSupport.clonedProps;
    // oldTagSetup.latestClonedProps = tempResult.tagSupport.latestClonedProps
    if (!isSameTag) {
        existingSubject.tag = redraw;
        subjectValue.tagSupport = tempResult.tagSupport;
    }
    return;
}
//# sourceMappingURL=updateExistingTagComponent.function.js.map