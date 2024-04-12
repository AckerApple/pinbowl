import { runAfterRender, runBeforeRedraw, runBeforeRender } from './tagRunner';
import { setUse } from './setUse.function';
import { isLikeTags } from './isLikeTags.function';
import { destroyTagMemory } from './destroyTag.function';
export class TemplaterResult {
    props;
    children;
    isTag = false; // when true, is basic tag non-component
    tagged;
    wrapper;
    global = {
        newestTemplater: this,
        context: {}, // populated after reading interpolated.values array converted to an object {variable0, variable:1}
        providers: [],
        /** Indicator of re-rending. Saves from double rending something already rendered */
        renderCount: 0,
        deleted: false,
        subscriptions: []
    };
    tagSupport;
    constructor(props, children) {
        this.props = props;
        this.children = children;
    }
    /*
    redraw?: (
      force?: boolean, // force children to redraw
    ) => Tag
    */
    isTemplater = true;
}
export function renderWithSupport(tagSupport, existingTag, subject, ownerTag) {
    const wrapTagSupport = tagSupport; // this.tagSupport
    /* BEFORE RENDER */
    const runtimeOwnerTag = existingTag?.ownerTag || ownerTag;
    if (existingTag) {
        wrapTagSupport.memory.state.newest = [...existingTag.tagSupport.memory.state.newest];
        wrapTagSupport.templater.global = existingTag.tagSupport.templater.global;
        runBeforeRedraw(wrapTagSupport, existingTag);
    }
    else {
        if (!wrapTagSupport) {
            throw new Error('63521');
        }
        // first time render
        runBeforeRender(wrapTagSupport, runtimeOwnerTag);
        // TODO: Logic below most likely could live within providers.ts inside the runBeforeRender function
        const providers = setUse.memory.providerConfig;
        providers.ownerTag = runtimeOwnerTag;
    }
    /* END: BEFORE RENDER */
    const templater = wrapTagSupport.templater;
    // NEW TAG CREATED HERE
    const retag = templater.wrapper(wrapTagSupport, subject);
    /* AFTER */
    runAfterRender(wrapTagSupport, retag);
    const isLikeTag = !existingTag || isLikeTags(existingTag, retag);
    if (!isLikeTag) {
        destroyUnlikeTags(existingTag, templater, subject);
    }
    retag.ownerTag = runtimeOwnerTag;
    wrapTagSupport.templater.global.newest = retag;
    return retag;
}
function destroyUnlikeTags(existingTag, // old
templater, // new
subject) {
    const oldGlobal = existingTag.tagSupport.templater.global;
    const insertBefore = oldGlobal.insertBefore;
    destroyTagMemory(existingTag, subject);
    // ??? - new so that when a tag is destroy the unlike does not carry the destroy signifier
    templater.global = { ...templater.global }; // break memory references
    const global = templater.global;
    global.insertBefore = insertBefore;
    global.deleted = false;
    delete global.oldest;
    delete global.newest;
    delete subject.tag;
}
//# sourceMappingURL=TemplaterResult.class.js.map