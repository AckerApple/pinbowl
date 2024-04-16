import { hasTagSupportChanged } from './hasTagSupportChanged.function';
import { processSubjectComponent } from './processSubjectComponent.function';
import { destroyTagMemory } from './destroyTag.function';
import { renderTagSupport } from './renderTagSupport.function';
import { callbackPropOwner } from './alterProps.function';
export function updateExistingTagComponent(ownerTag, templater, subject, insertBefore) {
    let existingTag = subject.tag;
    const oldWrapper = existingTag.tagSupport.templater.wrapper;
    const newWrapper = templater.wrapper;
    let isSameTag = false;
    if (oldWrapper && newWrapper) {
        const oldFunction = oldWrapper.original;
        const newFunction = newWrapper.original;
        isSameTag = oldFunction === newFunction;
    }
    const oldTagSupport = existingTag.tagSupport;
    const oldGlobal = oldTagSupport.templater.global;
    // const placeholderElm = ownerTag.tagSupport.templater.global.placeholderElm
    const placeholderElm = oldGlobal.placeholder;
    if (placeholderElm) {
        if (!placeholderElm.parentNode) {
            throw new Error('stop here no subject parent node update existing tag');
        }
    }
    if (!isSameTag) {
        destroyTagMemory(oldTagSupport.templater.global.oldest, subject);
        return processSubjectComponent(templater, subject, 
        // ??? - newly changed
        insertBefore, // oldInsertBefore,
        ownerTag, {
            forceElement: false,
            counts: { added: 0, removed: 0 },
        });
    }
    else {
        const newTagSupport = templater.tagSupport;
        const hasChanged = hasTagSupportChanged(oldTagSupport, newTagSupport, templater);
        if (!hasChanged) {
            // if the new props are an object then implicitly since no change, the old props are an object
            const newProps = templater.props;
            if (newProps && typeof (newProps) === 'object') {
                // const newestTag = oldTagSupport.templater.global.newest
                // const oldProps = existingTag.tagSupport.propsConfig.latestCloned as Record<string,any> // newestTag.props as Record<string, any>
                syncFunctionProps(templater, existingTag, ownerTag, newProps);
            }
            return existingTag; // its the same tag component
        }
    }
    const oldestTag = templater.global.oldest; // oldTagSupport.oldest as Tag // existingTag
    const previous = templater.global.newest;
    if (!previous || !oldestTag) {
        throw new Error('how no previous or oldest nor newest?');
    }
    const newTag = renderTagSupport(templater.tagSupport, false);
    existingTag = subject.tag;
    const newOldest = newTag.tagSupport.templater.global.oldest;
    const hasOldest = newOldest ? true : false;
    if (!hasOldest) {
        return buildNewTag(newTag, 
        // ??? newly changed
        insertBefore, // oldInsertBefore,
        oldTagSupport, subject);
    }
    if (newOldest && templater.children.value.length) {
        const oldKidsSub = newOldest.tagSupport.templater.children;
        oldKidsSub.set(templater.children.value);
    }
    // const newTag = tempResult.newest as Tag
    if (previous && !oldestTag) {
        throw new Error('bad elders');
    }
    // detect if both the function is the same and the return is the same
    const isLikeTag = isSameTag && previous.isLikeTag(newTag);
    if (previous && !oldestTag) {
        throw new Error('bad elders');
    }
    let oldest = oldTagSupport.templater.global.oldest;
    if (isLikeTag) {
        if (!newTag.tagSupport.templater.global.oldest) {
            throw new Error('maybe 6');
        }
        subject.tag = newTag;
        oldestTag.updateByTag(newTag); // the oldest tag has element references
        return newTag;
    }
    else {
        // Although function looked the same it returned a different html result
        if (isSameTag && existingTag) {
            destroyTagMemory(existingTag, subject);
            newTag.tagSupport.templater.global.context = {}; // do not share previous outputs
        }
        oldest = undefined;
    }
    if (!oldest) {
        buildNewTag(newTag, oldTagSupport.templater.global.insertBefore, oldTagSupport, subject);
    }
    oldTagSupport.templater.global.newest = newTag;
    return newTag;
}
function checkStateChanged(state) {
    return !state.newest.every(state => {
        const lastValue = state.lastValue;
        const nowValue = state.get();
        const matched = lastValue === nowValue;
        if (matched) {
            return true;
        }
        return false;
    });
}
function buildNewTag(newTag, oldInsertBefore, oldTagSupport, subject) {
    newTag.buildBeforeElement(oldInsertBefore, {
        forceElement: true,
        counts: { added: 0, removed: 0 },
    });
    newTag.tagSupport.templater.global.oldest = newTag;
    newTag.tagSupport.templater.global.newest = newTag;
    oldTagSupport.templater.global.oldest = newTag;
    oldTagSupport.templater.global.newest = newTag;
    subject.tag = newTag;
    return newTag;
}
function syncFunctionProps(templater, existingTag, ownerTag, newProps) {
    existingTag = existingTag.tagSupport.templater.global.newest;
    // const templater = existingTag.tagSupport.templater
    const priorProps = existingTag.tagSupport.propsConfig.latestCloned;
    const oldLatest = ownerTag.tagSupport.templater.global.newest;
    const ownerSupport = oldLatest.tagSupport;
    Object.entries(priorProps).forEach(([name, value]) => {
        if (!(value instanceof Function)) {
            return;
        }
        const newOriginal = value.original;
        // TODO: The code below maybe irrelevant
        const newCallback = newProps[name];
        const original = newCallback.original;
        if (original) {
            return; // already previously converted
        }
        // Currently, call self but over parent state changes, I may need to call a newer parent tag owner
        priorProps[name].toCall = (...args) => {
            return callbackPropOwner(newCallback, // value, // newOriginal,
            args, templater, ownerSupport);
        };
        return;
    });
}
//# sourceMappingURL=updateExistingTagComponent.function.js.map