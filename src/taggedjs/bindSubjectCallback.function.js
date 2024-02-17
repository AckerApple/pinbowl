export function bindSubjectCallback(value, tag) {
    function subjectFunction(element, args) {
        const renderCount = tag.tagSupport.memory.renderCount;
        const method = value.bind(element);
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
    // link back to original. Mostly used for <div oninit ondestroy> animations
    subjectFunction.tagFunction = value;
    return subjectFunction;
}
//# sourceMappingURL=bindSubjectCallback.function.js.map