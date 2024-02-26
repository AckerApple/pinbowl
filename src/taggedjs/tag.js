import { isSubjectInstance, isTagArray, isTagInstance } from "./isInstance.js";
import { setUse } from "./setUse.function.js";
import { TemplaterResult, alterProps } from "./templater.utils.js";
import { ValueSubject } from "./ValueSubject.js";
import { runTagCallback } from "./bindSubjectCallback.function.js";
export const tags = [];
let tagCount = 0;
/** Wraps a tag component in a state manager and always push children to last argument as any array */
export function tag(tagComponent) {
    const result = (function tagWrapper(props, children) {
        const isPropTag = isTagInstance(props) || isTagArray(props);
        if (isPropTag) {
            children = props;
            props = undefined;
        }
        const { childSubject, madeSubject } = kidsToTagArraySubject(children);
        childSubject.isChildSubject = true;
        const templater = new TemplaterResult(props, childSubject);
        /*
        if(!isPropTag) {
          // wrap props that are functions
          templater.tagSupport.props = alterProps(props, templater)
        }
        */
        function innerTagWrap() {
            const originalFunction = innerTagWrap.original;
            const props = alterProps(templater.tagSupport.props, templater); // templater.tagSupport.props
            const tag = originalFunction(props, childSubject);
            tag.tagSupport = templater.tagSupport;
            if (madeSubject) {
                childSubject.value.forEach(kid => {
                    kid.values.forEach((value, index) => {
                        if (!(value instanceof Function)) {
                            return;
                        }
                        if (kid.values[index].isChildOverride) {
                            return; // already overwritten
                        }
                        // all functions need to report to me
                        kid.values[index] = function (...args) {
                            runTagCallback(value, tag.ownerTag, this, args);
                            // runTagCallback(value, tag, this, args)
                        };
                        kid.values[index].isChildOverride = true;
                    });
                });
            }
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
function kidsToTagArraySubject(children) {
    if (isSubjectInstance(children)) {
        return { childSubject: children, madeSubject: false };
    }
    const kidArray = children;
    if (isTagArray(kidArray)) {
        return { childSubject: new ValueSubject(children), madeSubject: true };
    }
    const kid = children;
    if (kid) {
        kid.arrayValue = 0;
        return { childSubject: new ValueSubject([kid]), madeSubject: true };
    }
    return { childSubject: new ValueSubject([]), madeSubject: true };
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