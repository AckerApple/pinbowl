import { isSubjectInstance, isTagArray, isTagInstance } from './isInstance';
import { setUse } from './setUse.function';
import { TemplaterResult } from './TemplaterResult.class';
import { runTagCallback } from './bindSubjectCallback.function';
import { deepClone } from './deepFunctions';
import { TagSupport } from './TagSupport.class';
import { alterProps } from './alterProps.function';
import { ValueSubject } from './subject/ValueSubject';
export const tags = [];
let tagCount = 0;
/** Wraps a tag component in a state manager and always push children to last argument as an array */
// export function tag<T>(a: T): T;
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
        const innerTagWrap = getTagWrap(templater, madeSubject);
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
}
/** creates/returns a function that when called then calls the original component function */
function getTagWrap(templater, madeSubject) {
    const innerTagWrap = function (oldTagSetup, subject) {
        const global = oldTagSetup.templater.global;
        global.newestTemplater = templater;
        ++global.renderCount;
        templater.global = global;
        const childSubject = templater.children;
        const lastArray = global.oldest?.tagSupport.templater.children.lastArray;
        if (lastArray) {
            childSubject.lastArray = lastArray;
        }
        const originalFunction = innerTagWrap.original;
        // const oldTagSetup = templater.tagSupport
        const oldest = templater.global.oldest;
        if (oldest && !oldest.hasLiveElements) {
            throw new Error('issue already 22');
        }
        let props = templater.props;
        const ownerTagSupport = oldTagSetup.ownerTagSupport;
        const oldTemplater = ownerTagSupport?.templater;
        const oldLatest = oldTemplater?.global.newest;
        const newestOwnerTemplater = oldLatest?.tagSupport.templater;
        if (oldLatest && !newestOwnerTemplater) {
            throw new Error('what to do here?');
        }
        let castedProps = alterProps(props, newestOwnerTemplater, oldTagSetup.ownerTagSupport);
        const clonedProps = deepClone(props); // castedProps
        // CALL ORIGINAL COMPONENT FUNCTION
        const tag = originalFunction(castedProps, childSubject);
        tag.version = global.renderCount;
        tag.tagSupport = new TagSupport(oldTagSetup.ownerTagSupport, templater, subject);
        tag.tagSupport.propsConfig = {
            latest: props, // castedProps
            latestCloned: clonedProps,
            clonedProps: clonedProps,
            lastClonedKidValues: tag.tagSupport.propsConfig.lastClonedKidValues,
        };
        tag.tagSupport.memory = oldTagSetup.memory; // state handover
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
                        const ownerTag = tag.ownerTag;
                        runTagCallback(value, // callback
                        ownerTag, this, // bindTo
                        args);
                    };
                    valuesValue.isChildOverride = true;
                });
            });
        }
        return tag;
    };
    return innerTagWrap;
}
//# sourceMappingURL=tag.js.map