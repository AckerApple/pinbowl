import { getTagSupport } from "./getTagSupport.js";
import { isTagInstance } from "./isInstance.js";
import { runAfterRender, runBeforeRedraw, runBeforeRender } from "./tagRunner.js";
import { setUse } from "./setUse.function.js";
export class TemplaterResult {
    tagged;
    wrapper;
    newest;
    oldest;
    tagSupport;
    constructor(props) {
        this.tagSupport = getTagSupport(this, props);
    }
    redraw;
    isTemplater = true;
    forceRenderTemplate(tagSupport, ownerTag) {
        const tag = this.wrapper();
        tag.setSupport(tagSupport);
        tag.afterRender();
        this.oldest = tag;
        tagSupport.oldest = tag;
        this.oldest = tag;
        this.newest = tag;
        tag.ownerTag = ownerTag;
        return tag;
    }
    renderWithSupport(tagSupport, existingTag, ownerTag) {
        /* BEFORE RENDER */
        // signify to other operations that a rendering has occurred so they do not need to render again
        ++tagSupport.memory.renderCount;
        const runtimeOwnerTag = existingTag?.ownerTag || ownerTag;
        if (tagSupport.oldest) {
            // ensure props are the last ones used
            tagSupport.props = tagSupport.latestProps;
            tagSupport.clonedProps = tagSupport.latestClonedProps;
            // tagSupport.latestClonedProps = tagSupport.latestClonedProps
            runBeforeRedraw(tagSupport, tagSupport.oldest);
        }
        else {
            // first time render
            runBeforeRender(tagSupport, runtimeOwnerTag);
            // TODO: Logic below most likely could live within providers.ts inside the runBeforeRender function
            const providers = setUse.memory.providerConfig;
            providers.ownerTag = runtimeOwnerTag;
        }
        /* END: BEFORE RENDER */
        const templater = this;
        const retag = templater.wrapper();
        /* AFTER */
        tagSupport.latestProps = retag.tagSupport.props;
        tagSupport.latestClonedProps = retag.tagSupport.clonedProps;
        // tagSupport.latestClonedProps = retag.tagSupport.latestClonedProps
        retag.setSupport(tagSupport);
        runAfterRender(tagSupport, retag);
        templater.newest = retag;
        retag.ownerTag = runtimeOwnerTag;
        const oldest = tagSupport.oldest = tagSupport.oldest || retag;
        tagSupport.newest = retag;
        const oldestTagSupport = oldest.tagSupport;
        oldest.tagSupport = oldestTagSupport || tagSupport;
        oldest.tagSupport.templater = templater;
        // retag.setSupport(tagSupport)
        const isSameTag = existingTag && existingTag.isLikeTag(retag);
        // If previously was a tag and seems to be same tag, then just update current tag with new values
        if (isSameTag) {
            oldest.updateByTag(retag);
            return { remit: false, retag };
        }
        return { remit: true, retag };
    }
}
/* rewriter */
export function getNewProps(props, templater) {
    function callback(toCall, callWith) {
        const callbackResult = toCall(...callWith);
        templater.newest?.ownerTag?.tagSupport.render();
        return callbackResult;
    }
    const isPropTag = isTagInstance(props);
    const watchProps = isPropTag ? 0 : props;
    const newProps = resetFunctionProps(watchProps, callback);
    return newProps;
}
function resetFunctionProps(props, callback) {
    if (typeof (props) !== 'object') {
        return props;
    }
    const newProps = { ...props };
    Object.entries(newProps).forEach(([name, value]) => {
        if (value instanceof Function) {
            newProps[name] = (...args) => {
                return callback(value, args);
            };
            return;
        }
        newProps[name] = value;
    });
    return newProps;
}
//# sourceMappingURL=templater.utils.js.map