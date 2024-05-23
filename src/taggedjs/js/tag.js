import { isSubjectInstance, isTagArray, isTagClass, isTagTemplater } from './isInstance';
import { setUse } from './state';
import { TemplaterResult } from './TemplaterResult.class';
import { runTagCallback } from './interpolations/bindSubjectCallback.function';
import { deepClone } from './deepFunctions';
import { TagSupport } from './tag/TagSupport.class';
import { alterProps } from './alterProps.function';
import { ValueSubject } from './subject/ValueSubject';
export const tags = [];
let tagCount = 0;
/** Wraps a tag component in a state manager and always push children to last argument as an array */
// export function tag<T>(a: T): T;
export function tag(tagComponent) {
    /** function developer triggers */
    const result = (function tagWrapper(props, children) {
        // is the props argument actually children?
        const isPropTag = isTagClass(props) || isTagTemplater(props) || isTagArray(props);
        if (isPropTag) {
            children = props;
            props = undefined;
        }
        const { childSubject, madeSubject } = kidsToTagArraySubject(children);
        childSubject.isChildSubject = true;
        const templater = new TemplaterResult(props, childSubject);
        // attach memory back to original function that contains developer display logic
        const innerTagWrap = getTagWrap(templater, madeSubject);
        innerTagWrap.original = tagComponent.lastResult?.original || tagComponent;
        templater.tagged = true;
        templater.wrapper = innerTagWrap;
        return templater;
    }); // we override the function provided and pretend original is what's returned
    updateResult(result, tagComponent);
    // group tags together and have hmr pickup
    updateComponent(tagComponent);
    tags.push(tagComponent);
    // fake the return as being (props?, children?) => TemplaterResult
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
        kid.memory.arrayValue = 0;
        return { childSubject: new ValueSubject([kid]), madeSubject: true };
    }
    return {
        childSubject: new ValueSubject([]),
        madeSubject: true
    };
}
function updateResult(result, tagComponent) {
    result.isTag = true;
    result.original = tagComponent;
}
function updateComponent(tagComponent) {
    tagComponent.tags = tags;
    tagComponent.setUse = setUse;
    tagComponent.tagIndex = tagCount++; // needed for things like HMR
    tagComponent.lastResult = tagComponent;
}
/** creates/returns a function that when called then calls the original component function
 * Gets used as templater.wrapper()
 */
function getTagWrap(templater, madeSubject) {
    // this function gets called by taggedjs
    const innerTagWrap = function (oldTagSetup, subject) {
        const global = oldTagSetup.global;
        ++global.renderCount;
        const childSubject = templater.children;
        const lastArray = global.oldest?.templater.children.lastArray;
        if (lastArray) {
            childSubject.lastArray = lastArray;
        }
        const originalFunction = innerTagWrap.original;
        let props = templater.props;
        let castedProps = alterProps(props, oldTagSetup.ownerTagSupport);
        const clonedProps = deepClone(props); // castedProps
        // CALL ORIGINAL COMPONENT FUNCTION
        const tag = originalFunction(castedProps, childSubject);
        tag.templater = templater;
        templater.tag = tag;
        const tagSupport = new TagSupport(templater, oldTagSetup.ownerTagSupport, subject, global.renderCount);
        tagSupport.global = global;
        tagSupport.propsConfig = {
            latest: props,
            latestCloned: clonedProps,
            lastClonedKidValues: tagSupport.propsConfig.lastClonedKidValues,
        };
        tagSupport.memory = oldTagSetup.memory; // state handover
        if (madeSubject) {
            childSubject.value.forEach(kid => {
                kid.values.forEach((value, index) => {
                    if (!(value instanceof Function)) {
                        return;
                    }
                    const valuesValue = kid.values[index];
                    if (valuesValue.isChildOverride) {
                        return; // already overwritten
                    }
                    // all functions need to report to me
                    kid.values[index] = function (...args) {
                        const ownerSupport = tagSupport.ownerTagSupport;
                        runTagCallback(value, // callback
                        ownerSupport, this, // bindTo
                        args);
                    };
                    valuesValue.isChildOverride = true;
                });
            });
        }
        return tagSupport;
    };
    return innerTagWrap;
}
//# sourceMappingURL=tag.js.map