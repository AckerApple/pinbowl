import { getTemplaterResult } from '../TemplaterResult.class.js';
import { newSupportByTemplater } from './processTag.function.js';
import { PropWatches } from '../tag.js';
export function oneRenderToSupport(wrapper, subject, ownerSupport) {
    const templater = getTemplaterResult(PropWatches.DEEP);
    templater.tagJsType = wrapper.tagJsType;
    const support = newSupportByTemplater(templater, ownerSupport, subject);
    let tag;
    function wrap() {
        templater.tag = tag || (wrapper());
        return support;
    }
    templater.wrapper = wrap;
    wrap.parentWrap = wrap;
    wrap.tagJsType = wrapper.tagJsType;
    wrap.parentWrap.original = wrapper;
    return support;
}
//# sourceMappingURL=oneRenderToSupport.function.js.map