// taggedjs-no-compile
/** File largely responsible for reacting to element events, such as onclick */
import { isPromise, isTagComponent } from '../../isInstance.js';
import { renderSupport } from '../../tag/render/renderSupport.function.js';
import { getUpTags } from './getUpTags.function.js';
import { renderTagUpdateArray } from './renderTagArray.function.js';
const noData = 'no-data-ever';
const promiseNoData = 'promise-no-data-ever';
export function bindSubjectCallback(value, support) {
    const global = support.subject.global;
    // MAIN EVENT CALLBACK PROCESSOR
    const subjectFunction = function (element, args) {
        if (global.deleted === true) {
            return;
        }
        // const newest = global.newest as Support // || subjectFunction.support
        return runTagCallback(subjectFunction.tagFunction, subjectFunction.support, // newest
        element, args);
    };
    // link back to original. Mostly used for <div oninit ondestroy> animations
    subjectFunction.tagFunction = value;
    subjectFunction.support = support;
    return subjectFunction;
}
export function runTagCallback(value, support, bindTo, args) {
    // get actual component owner not just the html`` support
    let component = support;
    while (component.ownerSupport && !isTagComponent(component.templater)) {
        component = component.ownerSupport;
    }
    const global = component.subject.global; // tag.subject.global as TagGlobal
    global.locked = true; // prevent another render from re-rendering this tag
    // ACTUAL CALLBACK TO ORIGINAL FUNCTION
    const callbackResult = value.apply(bindTo, args);
    return afterTagCallback(callbackResult, component);
}
export function afterTagCallback(callbackResult, eventHandlerSupport) {
    const global = eventHandlerSupport.subject.global; // tag.subject.global as SupportTagGlobal
    delete global.locked;
    return renderCallbackSupport(eventHandlerSupport, callbackResult, global);
}
function renderCallbackSupport(last, callbackResult, global) {
    const tagsToUpdate = getUpTags(last);
    renderTagUpdateArray(tagsToUpdate);
    return checkAfterCallbackPromise(callbackResult, last, global);
}
export function checkAfterCallbackPromise(callbackResult, last, global) {
    if (isPromise(callbackResult)) {
        const global0 = last.subject.global;
        global0.locked = true;
        return callbackResult.then(() => {
            if (global.deleted === true) {
                return promiseNoData; // tag was deleted during event processing
            }
            const global1 = last.subject.global;
            delete global1.locked;
            const tagsToUpdate = getUpTags(last);
            renderTagUpdateArray(tagsToUpdate);
            return promiseNoData;
        });
    }
    return noData;
}
export function runBlocked(tag) {
    const global = tag.subject.global;
    const blocked = global.blocked;
    for (const block of blocked) {
        const lastResult = renderSupport(block);
        global.newest = lastResult;
    }
    global.blocked = [];
    return global.newest;
}
//# sourceMappingURL=bindSubjectCallback.function.js.map