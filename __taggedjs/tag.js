import { deepClone } from "./deepFunctions.js";
import { isTagInstance } from "./isInstance.js";
export class TemplaterResult {
    props;
    newProps;
    cloneProps;
    tagged;
    wrapper;
    newest;
    oldest;
    redraw;
    isTemplater = true;
    forceRenderTemplate(tagSupport, ownerTag) {
        const tag = this.wrapper();
        tag.tagSupport = tagSupport;
        tag.afterRender();
        this.oldest = tag;
        tagSupport.oldest = tag;
        this.oldest = tag;
        this.newest = tag;
        tag.ownerTag = ownerTag;
        return tag;
    }
    renderWithSupport(tagSupport, runtimeOwnerTag, existingTag) {
        const templater = this;
        const retag = templater.wrapper();
        retag.tagSupport = tagSupport;
        if (tagSupport.oldest) {
            tagSupport.oldest.afterRender();
        }
        else {
            retag.afterRender();
        }
        templater.newest = retag;
        retag.ownerTag = runtimeOwnerTag;
        const oldest = tagSupport.oldest = tagSupport.oldest || retag;
        tagSupport.newest = retag;
        const oldestTagSupport = oldest.tagSupport;
        oldest.tagSupport = oldestTagSupport || tagSupport;
        oldest.tagSupport.templater = templater;
        // retag.getTemplate() // cause lastTemplateString to render
        retag.setSupport(tagSupport);
        const isSameTag = existingTag && existingTag.isLikeTag(retag);
        // If previously was a tag and seems to be same tag, then just update current tag with new values
        if (isSameTag) {
            oldest.updateByTag(retag);
            return { remit: false, retag };
        }
        return { remit: true, retag };
    }
}
export function tag(tagComponent) {
    const result = (function tagWrapper(props, children) {
        function callback(toCall, callWith) {
            const callbackResult = toCall(...callWith);
            templater.newest?.ownerTag?.tagSupport.render();
            return callbackResult;
        }
        const isPropTag = isTagInstance(props);
        const watchProps = isPropTag ? 0 : props;
        const newProps = resetFunctionProps(watchProps, callback);
        let argProps = newProps;
        if (isPropTag) {
            children = props;
            argProps = noPropsGiven;
        }
        function innerTagWrap() {
            return innerTagWrap.original(argProps, children);
        }
        innerTagWrap.original = tagComponent;
        const templater = new TemplaterResult();
        templater.tagged = true;
        templater.props = props; // used to call function
        templater.newProps = newProps;
        templater.cloneProps = deepClone(newProps);
        templater.wrapper = innerTagWrap;
        return templater;
    }) // we override the function provided and pretend original is what's returned
    ;
    result.isTag = true;
    return result;
}
class NoPropsGiven {
}
const noPropsGiven = new NoPropsGiven();
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
//# sourceMappingURL=tag.js.map