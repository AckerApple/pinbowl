/** File largely responsible for reacting to element events, such as onclick */
import { renderTagSupport } from "./renderTagSupport.function";
export function bindSubjectCallback(value, tag) {
    // Is this children? No override needed
    if (value.isChildOverride) {
        return value;
    }
    if (!tag.ownerTag && !tag.tagSupport.templater.global.isApp) {
        throw new Error('no ownerTag issue here');
    }
    const subjectFunction = (element, args) => runTagCallback(value, tag, element, args);
    // link back to original. Mostly used for <div oninit ondestroy> animations
    subjectFunction.tagFunction = value;
    return subjectFunction;
}
export function runTagCallback(value, tag, bindTo, args) {
    const tagSupport = tag.tagSupport;
    const renderCount = tagSupport.templater.global.renderCount;
    const method = value.bind(bindTo);
    const callbackResult = method(...args);
    const sameRenderCount = renderCount === tagSupport.templater.global.renderCount;
    // already rendered OR tag was deleted before event processing
    if (!sameRenderCount || tagSupport.templater.global.deleted) {
        if (callbackResult instanceof Promise) {
            return callbackResult.then(() => {
                return 'promise-no-data-ever'; // tag was deleted during event processing
            });
        }
        return 'no-data-ever'; // already rendered
    }
    renderTagSupport(tagSupport, true);
    if (callbackResult instanceof Promise) {
        return callbackResult.then(() => {
            if (tagSupport.templater.global.deleted) {
                return 'promise-no-data-ever'; // tag was deleted during event processing
            }
            renderTagSupport(tagSupport, true);
            return 'promise-no-data-ever';
        });
    }
    // Caller always expects a Promise
    return 'no-data-ever';
}
//# sourceMappingURL=bindSubjectCallback.function.js.map