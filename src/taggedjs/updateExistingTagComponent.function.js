import { setValueRedraw } from "./Tag.utils.js";
import { deepClone } from "./deepFunctions.js";
import { isTagInstance } from "./isInstance.js";
import { hasTagSupportChanged } from "./hasTagSupportChanged.function.js";
import { destroyTagMemory } from "./checkDestroyPrevious.function.js";
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
    const latestProps = tempResult.tagSupport.propsConfig.latest;
    const oldTagSetup = existingTag.tagSupport;
    oldTagSetup.propsConfig.latest = latestProps;
    if (!isSameTag) {
        destroyTagMemory(existingTag, existingSubject);
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
            const newTagSupport = tempResult.tagSupport;
            const hasChanged = hasTagSupportChanged(oldTagSetup, newTagSupport);
            if (!hasChanged) {
                return; // its the same tag component
            }
        }
    }
    setValueRedraw(tempResult, existingSubject, tag);
    oldTagSetup.templater = tempResult;
    const redraw = tempResult.redraw();
    if (!existingTag.isLikeTag(redraw)) {
        existingTag.destroy();
        existingSubject.tagSupport = redraw.tagSupport;
        existingSubject.tag = redraw;
        oldTagSetup.oldest = redraw;
    }
    oldTagSetup.newest = redraw;
    oldTagSetup.propsConfig = { ...tempResult.tagSupport.propsConfig };
    return;
}
//# sourceMappingURL=updateExistingTagComponent.function.js.map