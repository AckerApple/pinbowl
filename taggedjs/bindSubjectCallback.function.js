/** File largely responsible for reacting to element events, such as onclick */
export function bindSubjectCallback(value, tag) {
    // Is this children? No override needed
    if (value.isChildOverride) {
        return value;
    }
    const subjectFunction = (element, args) => runTagCallback(value, tag, element, args);
    // link back to original. Mostly used for <div oninit ondestroy> animations
    subjectFunction.tagFunction = value;
    return subjectFunction;
}
export function runTagCallback(value, tag, bindTo, args) {
    const tagSupport = tag.tagSupport;
    const renderCount = tagSupport ? tagSupport.memory.renderCount : 0;
    const method = value.bind(bindTo);
    const callbackResult = method(...args);
    const sameRenderCount = renderCount === tagSupport.memory.renderCount;
    // TODO: need to restore this
    if (tagSupport && !sameRenderCount) {
        // return // already rendered
    }
    tagSupport.render();
    if (callbackResult instanceof Promise) {
        return callbackResult.then(() => {
            tagSupport.render();
            return 'promise-no-data-ever';
        });
    }
    // Caller always expects a Promise
    return 'no-data-ever';
}
//# sourceMappingURL=bindSubjectCallback.function.js.map