import { deepEqual } from './deepFunctions';
import { renderExistingTag } from './renderExistingTag.function';
/** Main function used by all other callers to render/update display of a tag component */
export function renderTagSupport(tagSupport, renderUp) {
    const global = tagSupport.global;
    const templater = tagSupport.templater;
    // is it just a vanilla tag, not component?
    if (!templater.wrapper) { // || isTagTemplater(templater) 
        const newTag = global.newest;
        const ownerTag = newTag.ownerTagSupport;
        ++global.renderCount;
        return renderTagSupport(ownerTag, true);
    }
    const subject = tagSupport.subject;
    const newest = global.newest;
    let ownerSupport;
    let selfPropChange = false;
    const shouldRenderUp = renderUp && newest;
    if (shouldRenderUp) {
        ownerSupport = newest.ownerTagSupport;
        if (ownerSupport) {
            const nowProps = templater.props;
            const latestProps = newest.propsConfig.latestCloned;
            selfPropChange = !deepEqual(nowProps, latestProps);
        }
    }
    // const useTagSupport = global.newest as TagSupport // oldTagSetup
    const oldest = tagSupport.global.oldest;
    const tag = renderExistingTag(oldest, tagSupport, ownerSupport, // useTagSupport,
    subject);
    const renderOwner = ownerSupport && selfPropChange;
    if (renderOwner) {
        const ownerTagSupport = ownerSupport;
        renderTagSupport(ownerTagSupport, true);
        return tag;
    }
    return tag;
}
//# sourceMappingURL=renderTagSupport.function.js.map