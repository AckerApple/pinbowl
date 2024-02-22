export function bindSubjectCallback(value, tag) {
    // Is this children? No override needed
    if (value.isChildOverride) {
        return value;
    }
    function subjectFunction(element, args) {
        return runTagCallback(value, tag, element, args);
    }
    // link back to original. Mostly used for <div oninit ondestroy> animations
    subjectFunction.tagFunction = value;
    return subjectFunction;
}
export function runTagCallback(value, tag, bindTo, args) {
    const renderCount = tag.tagSupport.memory.renderCount;
    const method = value.bind(bindTo);
    const callbackResult = method(...args);
    if (renderCount !== tag.tagSupport.memory.renderCount) {
        return; // already rendered
    }
    tag.tagSupport.render();
    if (callbackResult instanceof Promise) {
        return callbackResult.then(() => tag.tagSupport.render() && 'no-data-ever');
    }
    // Caller always expects a Promise
    return Promise.resolve(callbackResult).then(() => 'no-data-ever');
}
//# sourceMappingURL=bindSubjectCallback.function.js.map