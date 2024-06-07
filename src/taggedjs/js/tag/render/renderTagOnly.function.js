import { runBeforeRedraw, runBeforeRender } from '../tagRunner.js';
import { runAfterRender } from '../tagRunner.js';
export function renderTagOnly(newTagSupport, prevSupport, subject, ownerSupport) {
    const oldRenderCount = newTagSupport.global.renderCount;
    beforeWithRender(newTagSupport, ownerSupport, prevSupport);
    const templater = newTagSupport.templater;
    // NEW TAG CREATED HERE
    const wrapper = templater.wrapper;
    let reSupport = wrapper(newTagSupport, subject);
    /* AFTER */
    runAfterRender(newTagSupport, ownerSupport);
    newTagSupport.global.newest = reSupport;
    if (!prevSupport && ownerSupport) {
        ownerSupport.global.childTags.push(reSupport);
    }
    // When we rendered, only 1 render should have taken place OTHERWISE rendering caused another render and that is the latest instead
    if (reSupport.global.renderCount > oldRenderCount + 1) {
        return newTagSupport.global.newest;
    }
    return reSupport;
}
function beforeWithRender(tagSupport, // new
parentSupport, prevSupport) {
    const lastOwnerSupport = prevSupport?.ownerTagSupport;
    const runtimeOwnerSupport = lastOwnerSupport || parentSupport;
    if (prevSupport) {
        if (prevSupport !== tagSupport) {
            const lastState = prevSupport.memory.state;
            const memory = tagSupport.memory;
            tagSupport.global = prevSupport.global;
            memory.state.length = 0;
            memory.state.push(...lastState);
        }
        return runBeforeRedraw(tagSupport, prevSupport);
    }
    // first time render
    return runBeforeRender(tagSupport, runtimeOwnerSupport);
}
//# sourceMappingURL=renderTagOnly.function.js.map