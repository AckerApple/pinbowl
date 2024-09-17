/** File largely responsible for reacting to element events, such as onclick */
import { syncStates } from '../state/syncStates.function.js';
import { ValueTypes } from '../tag/ValueTypes.enum.js';
import { renderSupport } from '../tag/render/renderSupport.function.js';
import { updateExistingTagComponent } from '../tag/update/updateExistingTagComponent.function.js';
const useLocks = true;
const noData = 'no-data-ever';
const promiseNoData = 'promise-no-data-ever';
export function bindSubjectCallback(value, support) {
    // Is this children? No override needed
    if (value.isChildOverride) {
        return value;
    }
    // const state = setUse.memory.stateConfig.support?.state as State
    const state = support.state;
    const subjectFunction = (element, args) => runTagCallback(value, support, element, args, state);
    // link back to original. Mostly used for <div oninit ondestroy> animations
    subjectFunction.tagFunction = value;
    return subjectFunction;
}
export function runTagCallback(value, support, bindTo, args, state) {
    const tag = findTagToCallback(support);
    const global = tag.subject.global;
    if (global.deleted) {
        return noData;
    }
    const newest = global.newest;
    const newState = newest.state;
    if (newState.length === state.length) {
        syncStates(newState, state);
    }
    // syncStates(newState, tag.state)
    // const renderCount = global.renderCount
    const method = value.bind(bindTo);
    tag.subject.global.locked = useLocks; // prevent another render from re-rendering this tag
    const callbackResult = method(...args);
    /*
    if(renderCount !== global.renderCount) {
      // ??? new - the lock should have been respected
      // return "no-data-ever"
    }
    */
    return afterTagCallback(tag, callbackResult, state);
}
export function afterTagCallback(tag, callbackResult, state) {
    const global = tag.subject.global;
    delete global.locked;
    const blocked = global.blocked;
    if (blocked.length) {
        let lastResult;
        lastResult = runBlocked(tag, state, lastResult);
        return checkAfterCallbackPromise(callbackResult, lastResult, global);
    }
    const result = renderCallbackSupport(global.newest, callbackResult, global);
    return result;
}
export function findTagToCallback(support) {
    // If we are NOT a component than we need to render my owner instead
    if (support.templater.tagJsType === ValueTypes.templater) {
        const owner = support.ownerSupport;
        return findTagToCallback(owner);
    }
    return support;
}
function renderCallbackSupport(last, callbackResult, global) {
    if (global.deleted) {
        return noData; // || last.global.deleted
    }
    renderSupport(last, true);
    return checkAfterCallbackPromise(callbackResult, last, global);
}
export function checkAfterCallbackPromise(callbackResult, last, global) {
    if (callbackResult instanceof Promise) {
        last.subject.global.locked = useLocks;
        return callbackResult.then(() => {
            delete last.subject.global.locked;
            if (global.deleted) {
                return promiseNoData; // tag was deleted during event processing
            }
            delete last.subject.global.locked;
            renderSupport(global.newest, true);
            return promiseNoData;
        });
    }
    return noData;
}
export function runBlocked(tag, state, lastResult) {
    const global = tag.subject.global;
    const blocked = global.blocked;
    while (blocked.length > 0) {
        const block = blocked[0];
        blocked.splice(0, 1);
        lastResult = updateExistingTagComponent(block.ownerSupport, block, block.subject, block.subject.global.insertBefore);
        global.newest = lastResult;
    }
    global.blocked.length = 0;
    // global.oldest.updateBy( lastResult as Support )
    /*
    if(lastResult) {
      const newState = lastResult.state
      syncStates(state, newState)
  
      const newest = renderSupport(
        lastResult,
        true,
      )
      
      global.newest = newest
      global.oldest.updateBy( lastResult as Support )
      syncStates(newState, state)
    }
      */
    return lastResult;
}
//# sourceMappingURL=bindSubjectCallback.function.js.map