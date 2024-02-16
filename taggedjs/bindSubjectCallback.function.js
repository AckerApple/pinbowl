export function bindSubjectCallback(value, tag) {
    function subjectFunction(element, args) {
        const renderCount = tag.tagSupport.memory.renderCount;
        console.log('start callback', { value });
        const method = value.bind(element);
        const callbackResult = method(...args);
        console.log('render counts', {
            renderCount,
            memoryCounter: tag.tagSupport.memory.renderCount,
        });
        if (renderCount !== tag.tagSupport.memory.renderCount) {
            return; // already rendered
        }
        console.log('---- rendering ----', {
            component: tag.tagSupport.templater.wrapper?.original,
            lastString: tag.lastTemplateString,
        });
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