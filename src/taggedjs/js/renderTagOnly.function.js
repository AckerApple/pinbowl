import { runBeforeRedraw, runBeforeRender } from './tag/tagRunner';
import { setUse } from './state';
import { runAfterRender } from './tag/tagRunner';
export function renderTagOnly(tagSupport, // new
lastSupport, subject, ownerSupport) {
    const oldRenderCount = tagSupport.global.renderCount;
    beforeWithRender(tagSupport, ownerSupport, lastSupport);
    const templater = tagSupport.templater;
    // NEW TAG CREATED HERE
    const wrapper = templater.wrapper;
    const reSupport = wrapper(tagSupport, subject);
    /* AFTER */
    runAfterRender(tagSupport, reSupport);
    // When we rendered, only 1 render should have taken place OTHERWISE rendering caused another render and that is the latest instead
    if (reSupport.global.renderCount > oldRenderCount + 1) {
        return tagSupport.global.newest;
    }
    tagSupport.global.newest = reSupport;
    return reSupport;
}
function beforeWithRender(tagSupport, ownerSupport, lastSupport) {
    const lastOwnerSupport = lastSupport?.ownerTagSupport;
    const runtimeOwnerSupport = lastOwnerSupport || ownerSupport;
    if (lastSupport) {
        const lastState = lastSupport.memory.state;
        const memory = tagSupport.memory;
        memory.state = [...lastState];
        tagSupport.global = lastSupport.global;
        runBeforeRedraw(tagSupport, lastSupport);
    }
    else {
        // first time render
        runBeforeRender(tagSupport, runtimeOwnerSupport);
        // TODO: Logic below most likely could live within providers.ts inside the runBeforeRender function
        const providers = setUse.memory.providerConfig;
        providers.ownerSupport = runtimeOwnerSupport;
    }
}
//# sourceMappingURL=renderTagOnly.function.js.map