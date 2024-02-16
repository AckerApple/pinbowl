import { isTagInstance } from "./isInstance.js";
import { setUse } from "./setUse.function.js";
import { TemplaterResult, getNewProps } from "./templater.utils.js";
export const tags = [];
let tagCount = 0;
export function tag(tagComponent) {
    const result = (function tagWrapper(props, children) {
        const isPropTag = isTagInstance(props);
        const templater = new TemplaterResult(props);
        const newProps = getNewProps(props, templater);
        let argProps = newProps;
        if (isPropTag) {
            children = props;
            argProps = noPropsGiven;
        }
        function innerTagWrap() {
            const originalFunction = innerTagWrap.original;
            const props = templater.tagSupport.props; // argProps
            const tag = originalFunction(props, children);
            tag.setSupport(templater.tagSupport);
            return tag;
        }
        innerTagWrap.original = tagComponent;
        templater.tagged = true;
        templater.wrapper = innerTagWrap;
        return templater;
    }); // we override the function provided and pretend original is what's returned
    updateResult(result, tagComponent);
    // group tags together and have hmr pickup
    updateComponent(tagComponent);
    tags.push(tagComponent);
    return result;
}
function updateResult(result, tagComponent) {
    result.isTag = true;
    result.original = tagComponent;
}
function updateComponent(tagComponent) {
    tagComponent.tags = tags;
    tagComponent.setUse = setUse;
    tagComponent.tagIndex = ++tagCount;
}
class NoPropsGiven {
}
const noPropsGiven = new NoPropsGiven();
//# sourceMappingURL=tag.js.map