import { runAfterRender, runBeforeRedraw, runBeforeRender } from './tagRunner';
import { setUse } from './state';
import { isLikeTags } from './isLikeTags.function';
import { destroyTagMemory } from './destroyTag.function';
export function renderWithSupport(tagSupport, // new
lastSupport, // previous
subject, // events & memory
ownerSupport) {
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
    const isLikeTag = !lastSupport || isLikeTags(lastSupport, reSupport);
    if (!isLikeTag) {
        destroyUnlikeTags(lastSupport, reSupport, subject);
    }
    const lastOwnerSupport = lastSupport?.ownerTagSupport;
    reSupport.ownerTagSupport = (ownerSupport || lastOwnerSupport);
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
function destroyUnlikeTags(lastSupport, // old
reSupport, // new
subject) {
    const oldGlobal = lastSupport.global;
    const insertBefore = oldGlobal.insertBefore;
    destroyTagMemory(lastSupport, subject);
    // when a tag is destroyed, disconnect the globals
    reSupport.global = { ...oldGlobal }; // break memory references
    const global = reSupport.global;
    global.insertBefore = insertBefore;
    global.deleted = false;
    delete global.oldest;
    delete global.newest;
    delete subject.tagSupport;
}
//# sourceMappingURL=renderWithSupport.function.js.map