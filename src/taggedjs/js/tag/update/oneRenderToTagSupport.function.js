import { TemplaterResult } from '../TemplaterResult.class.js';
import { newTagSupportByTemplater } from './processTag.function.js';
export function oneRenderToTagSupport(wrapper, subject, ownerSupport) {
    const templater = new TemplaterResult([]);
    templater.tagJsType = 'oneRender';
    const tagSupport = newTagSupportByTemplater(templater, ownerSupport, subject);
    let tag;
    const wrap = () => {
        templater.tag = tag || (wrapper());
        return tagSupport;
    };
    templater.wrapper = wrap;
    wrap.parentWrap = wrap;
    wrap.oneRender = true;
    wrap.parentWrap.original = wrapper;
    return tagSupport;
}
//# sourceMappingURL=oneRenderToTagSupport.function.js.map