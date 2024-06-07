/** File largely responsible for reacting to element events, such as onclick */
import { setUse } from '../state/setUse.function.js';
import { ValueTypes } from '../tag/ValueTypes.enum.js';
import { renderTagSupport } from '../tag/render/renderTagSupport.function.js';
import { updateExistingTagComponent } from '../tag/update/updateExistingTagComponent.function.js';
const useLocks = true;
export function bindSubjectCallback(value, tagSupport) {
    // Is this children? No override needed
    if (value.isChildOverride) {
        return value;
    }
    const state = setUse.memory.stateConfig;
    const subjectFunction = (element, args) => runTagCallback(value, tagSupport, element, args);
    // link back to original. Mostly used for <div oninit ondestroy> animations
    subjectFunction.tagFunction = value;
    return subjectFunction;
}
export function runTagCallback(value, tagSupport, bindTo, args) {
    const tag = findTagToCallback(tagSupport);
    const method = value.bind(bindTo);
    tag.global.locked = useLocks; // prevent another render from re-rendering this tag
    const callbackResult = method(...args);
    return afterTagCallback(tag, callbackResult);
}
function afterTagCallback(tag, callbackResult) {
    delete tag.global.locked;
    if (tag.global.blocked.length) {
        let lastResult;
        tag.global.blocked.forEach(blocked => {
            const block = blocked;
            lastResult = updateExistingTagComponent(block.ownerTagSupport, block, block.subject, block.global.insertBefore, true);
            tag.global.newest = lastResult;
            tag.global.blocked.splice(0, 1);
        });
        tag.global.blocked.length = 0;
        // return lastResult
        return checkAfterCallbackPromise(callbackResult, lastResult, lastResult.global);
    }
    const result = renderCallbackSupport(tag.global.newest, callbackResult, tag.global);
    return result;
}
function findTagToCallback(tagSupport) {
    // If we are NOT a component than we need to render my owner instead
    if (tagSupport.templater.tagJsType === ValueTypes.templater) {
        const owner = tagSupport.ownerTagSupport;
        return findTagToCallback(owner);
    }
    return tagSupport;
}
function renderCallbackSupport(last, callbackResult, global) {
    if (global.deleted) {
        return 'no-data-ever'; // || last.global.deleted
    }
    renderTagSupport(last, true);
    return checkAfterCallbackPromise(callbackResult, last, global);
}
function checkAfterCallbackPromise(callbackResult, last, global) {
    if (callbackResult instanceof Promise) {
        last.global.locked = useLocks;
        return callbackResult.then(() => {
            delete last.global.locked;
            if (global.deleted) {
                return 'promise-no-data-ever'; // tag was deleted during event processing
            }
            delete last.global.locked;
            renderTagSupport(global.newest, true);
            return 'promise-no-data-ever';
        });
    }
    return 'no-data-ever';
}
//# sourceMappingURL=bindSubjectCallback.function.js.map