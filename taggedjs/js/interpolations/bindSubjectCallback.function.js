/** File largely responsible for reacting to element events, such as onclick */
import { renderTagSupport } from "../tag/render/renderTagSupport.function";
export function bindSubjectCallback(value, tagSupport) {
    // Is this children? No override needed
    if (value.isChildOverride) {
        return value;
    }
    const subjectFunction = (element, args) => runTagCallback(value, tagSupport, element, args);
    // link back to original. Mostly used for <div oninit ondestroy> animations
    subjectFunction.tagFunction = value;
    return subjectFunction;
}
export function runTagCallback(value, tagSupport, bindTo, args) {
    const myGlobal = tagSupport.global;
    const renderCount = myGlobal.renderCount;
    const method = value.bind(bindTo);
    const callbackResult = method(...args);
    const sameRenderCount = renderCount === myGlobal.renderCount;
    const skipRender = !sameRenderCount || myGlobal.deleted;
    // already rendered OR tag was deleted before event processing
    if (skipRender) {
        if (callbackResult instanceof Promise) {
            return callbackResult.then(() => {
                return 'promise-no-data-ever'; // tag was deleted during event processing
            });
        }
        return 'no-data-ever'; // already rendered
    }
    const newest = renderTagSupport(myGlobal.newest, true);
    myGlobal.newest = newest;
    if (callbackResult instanceof Promise) {
        return callbackResult.then(() => {
            if (myGlobal.deleted) {
                return 'promise-no-data-ever'; // tag was deleted during event processing
            }
            const newest = renderTagSupport(myGlobal.newest, true);
            myGlobal.newest = newest;
            return 'promise-no-data-ever';
        });
    }
    // Caller always expects a Promise
    return 'no-data-ever';
}
//# sourceMappingURL=bindSubjectCallback.function.js.map