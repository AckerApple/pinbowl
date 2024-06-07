import { deepEqual } from '../../deepFunctions.js';
import { renderExistingTag } from './renderExistingTag.function.js';
/** Main function used by all other callers to render/update display of a tag component */
export function renderTagSupport(tagSupport, // must be latest/newest state render
renderUp) {
    const global = tagSupport.global;
    const templater = tagSupport.templater;
    // is it just a vanilla tag, not component?
    if (!templater.wrapper) { // || isTagTemplater(templater) 
        const ownerTag = tagSupport.ownerTagSupport;
        ++global.renderCount;
        if (ownerTag.global.deleted) {
            return tagSupport;
        }
        return renderTagSupport(ownerTag.global.newest, true);
    }
    if (tagSupport.global.locked) {
        tagSupport.global.blocked.push(tagSupport);
        return tagSupport;
    }
    const subject = tagSupport.subject;
    const oldest = tagSupport.global.oldest;
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
    const tag = renderExistingTag(oldest, tagSupport, ownerSupport, // useTagSupport,
    subject);
    if (ownerSupport && selfPropChange) {
        const ownerTagSupport = ownerSupport.global.newest;
        renderTagSupport(ownerTagSupport, true);
        return tag;
    }
    return tag;
}
//# sourceMappingURL=renderTagSupport.function.js.map