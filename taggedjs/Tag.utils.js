import { getTagSupport } from "./getTagSupport.js";
import { config as providers } from "./providers.js";
import { ValueSubject } from "./ValueSubject.js";
import { runBeforeRender } from "./tagRunner.js";
export function getSubjectFunction(value, tag) {
    return new ValueSubject(bindSubjectFunction(value, tag));
}
/**
 * @param {*} value
 * @param {Tag} tag
 * @returns
 */
export function bindSubjectFunction(value, tag) {
    function subjectFunction(element, args) {
        const renderCount = tag.tagSupport.renderCount;
        const method = value.bind(element);
        const callbackResult = method(...args);
        if (renderCount !== tag.tagSupport.renderCount) {
            return; // already rendered
        }
        tag.tagSupport.render();
        if (callbackResult instanceof Promise) {
            callbackResult.then(() => {
                tag.tagSupport.render();
            });
        }
        return callbackResult;
    }
    subjectFunction.tagFunction = value;
    return subjectFunction;
}
/**
 *
 * @param {*} templater
 * @param {ExistingValue} existing
 * @param {Tag} ownerTag
 */
export function setValueRedraw(templater, // latest tag function to call for rendering
existing, ownerTag) {
    // redraw does not communicate to parent
    templater.redraw = () => {
        // Find previous variables
        const existingTag = existing.tag;
        const tagSupport = existingTag?.tagSupport || getTagSupport(templater); // this.tagSupport
        // signify to other operations that a rendering has occurred so they do not need to render again
        ++tagSupport.renderCount;
        existing.tagSupport = tagSupport;
        // const self = this as any
        const self = templater;
        tagSupport.mutatingRender = tagSupport.mutatingRender || existing.tagSupport?.mutatingRender || ( /* TODO: we might be able to remove this last OR */self.tagSupport.mutatingRender);
        const runtimeOwnerTag = existingTag?.ownerTag || ownerTag;
        runBeforeRender(tagSupport, tagSupport.oldest);
        if (tagSupport.oldest) {
            tagSupport.oldest.beforeRedraw();
        }
        else {
            providers.ownerTag = runtimeOwnerTag;
        }
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
            return;
        }
        existing.set(templater);
        return retag;
    };
}
export function elementDestroyCheck(nextSibling, stagger) {
    const onDestroyDoubleWrap = nextSibling.ondestroy; // nextSibling.getAttribute('onDestroy')
    if (!onDestroyDoubleWrap) {
        return;
    }
    const onDestroyWrap = onDestroyDoubleWrap.tagFunction;
    if (!onDestroyWrap) {
        return;
    }
    const onDestroy = onDestroyWrap.tagFunction;
    if (!onDestroy) {
        return;
    }
    const event = { target: nextSibling, stagger };
    return onDestroy(event);
}
//# sourceMappingURL=Tag.utils.js.map