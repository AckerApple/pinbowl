import { hasTagSupportChanged } from "./hasTagSupportChanged.function.js";
import { providersChangeCheck } from "./provider.utils.js";
/** Returns true when rendering owner is not needed. Returns false when rendering owner should occur */
export function renderExistingTag(tag, newTemplater, tagSupport) {
    const preRenderCount = tagSupport.memory.renderCount;
    providersChangeCheck(tag);
    // When the providers were checked, a render to myself occurred and I do not need to re-render again
    if (preRenderCount !== tagSupport.memory.renderCount) {
        return true;
    }
    const oldTagSupport = tag.tagSupport;
    // ???
    // const oldTagSupport = tagSupport
    const hasChanged = hasTagSupportChanged(oldTagSupport, newTemplater.tagSupport);
    const oldTemplater = tagSupport.templater;
    tagSupport.newest = oldTemplater.redraw(); // No change detected, just redraw me only
    newTemplater.newest = tagSupport.newest;
    if (!hasChanged) {
        return true;
    }
    return false;
}
//# sourceMappingURL=renderExistingTag.function.js.map