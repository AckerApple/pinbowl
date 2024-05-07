import { deepEqual } from './deepFunctions';
import { renderExistingTag } from './renderExistingTag.function';
/** Main function used by all other callers to render/update display of a tag component */
export function renderTagSupport(tagSupport, // must be latest/newest state render
renderUp) {
    const global = tagSupport.global;
    const templater = tagSupport.templater;
    // is it just a vanilla tag, not component?
    if (!templater.wrapper) { // || isTagTemplater(templater) 
        const ownerTag = tagSupport.ownerTagSupport;
        ++global.renderCount;
        return renderTagSupport(ownerTag, true);
    }
    const subject = tagSupport.subject;
    let ownerSupport;
    let selfPropChange = false;
    const shouldRenderUp = renderUp && tagSupport;
    if (shouldRenderUp) {
        ownerSupport = tagSupport.ownerTagSupport;
        if (ownerSupport) {
            const nowProps = templater.props;
            const latestProps = tagSupport.propsConfig.latestCloned;
            selfPropChange = !deepEqual(nowProps, latestProps);
        }
    }
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