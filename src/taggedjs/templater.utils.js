import { TagSupport } from "./TagSupport.class.js";
import { isTagInstance } from "./isInstance.js";
import { runAfterRender, runBeforeRedraw, runBeforeRender } from "./tagRunner.js";
import { setUse } from "./setUse.function.js";
export class TemplaterResult {
    tagged;
    wrapper;
    insertBefore;
    newest;
    oldest;
    tagSupport;
    constructor(props, children) {
        this.tagSupport = new TagSupport(this, children, props);
    }
    redraw;
    isTemplater = true;
    renderWithSupport(tagSupport, existingTag, ownerTag) {
        /* BEFORE RENDER */
        // signify to other operations that a rendering has occurred so they do not need to render again
        ++tagSupport.memory.renderCount;
        const runtimeOwnerTag = existingTag?.ownerTag || ownerTag;
        // const insertBefore = tagSupport.templater.insertBefore
        if (existingTag) {
            tagSupport.propsConfig = { ...existingTag.tagSupport.propsConfig };
            runBeforeRedraw(tagSupport, existingTag);
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
        runAfterRender(tagSupport, retag);
        templater.newest = retag;
        retag.ownerTag = runtimeOwnerTag;
        tagSupport.newest = retag;
        // ???
        // const oldest = tagSupport.oldest = tagSupport.oldest || retag
        // oldest.tagSupport.templater = templater
        // oldest.tagSupport.memory = retag.tagSupport.memory
        // TODO: I think this is duplicated work of updateExistingValue?
        /*
        const isSameTag = existingTag && existingTag.isLikeTag(retag)
        // If previously was a tag and seems to be same tag, then just update current tag with new values
        if(isSameTag) {
          existingTag.updateByTag(retag)
          return {remit: false, retag}
        }
    
        // MAYBE destroy existing tag here?
    
        return {remit: true, retag}
        */
        return { remit: true, retag };
    }
}
/* Used to rewrite props that are functions. When they are called it should cause parent rendering */
export function alterProps(props, templater) {
    function callback(toCall, callWith) {
        const callbackResult = toCall(...callWith);
        const tagSupport = templater.newest?.ownerTag?.tagSupport;
        if (tagSupport) {
            tagSupport.render();
        }
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
    const newProps = props;
    // BELOW: Do not clone because if first argument is object, the memory ref back is lost
    // const newProps = {...props} 
    Object.entries(newProps).forEach(([name, value]) => {
        if (value instanceof Function) {
            const original = newProps[name].original;
            if (original) {
                newProps[name] = (...args) => {
                    return callback(value, args);
                };
                newProps[name].original = original;
                return; // already previously converted
            }
            newProps[name] = (...args) => {
                return callback(value, args);
            };
            newProps[name].original = value;
            return;
        }
    });
    return newProps;
}
//# sourceMappingURL=templater.utils.js.map