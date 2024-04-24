import { runAfterRender, runBeforeRedraw, runBeforeRender } from './tagRunner';
import { setUse } from './state';
import { isLikeTags } from './isLikeTags.function';
import { destroyTagMemory } from './destroyTag.function';
export class TemplaterResult {
    props;
    children;
    isTemplater = true;
    tagged;
    wrapper;
    tag;
    constructor(props, children) {
        this.props = props;
        this.children = children;
    }
}
export function renderWithSupport(tagSupport, // new
lastSupport, // previous
subject, // events & memory
ownerSupport) {
    /* BEFORE RENDER */
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
    /* END: BEFORE RENDER */
    const templater = tagSupport.templater;
    const subTag = subject.tagSupport;
    // NEW TAG CREATED HERE
    const wrapper = templater.wrapper;
    const reSupport = wrapper(tagSupport, subject);
    /* AFTER */
    runAfterRender(tagSupport, reSupport);
    const isLikeTag = !lastSupport || isLikeTags(lastSupport, reSupport);
    if (!isLikeTag) {
        destroyUnlikeTags(lastSupport, reSupport, subject);
    }
    reSupport.ownerTagSupport = (ownerSupport || lastOwnerSupport);
    tagSupport.global.newest = reSupport;
    return reSupport;
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
//# sourceMappingURL=TemplaterResult.class.js.map