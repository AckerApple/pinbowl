import { getStringTag, getDomTag } from './Tag.class.js';
import { PropWatches } from './tag.js';
import { getTemplaterResult } from './TemplaterResult.class.js';
export function html(strings, ...values) {
    const stringTag = getStringTag(strings, values);
    const templater = getTemplaterResult(PropWatches.NONE);
    templater.tag = stringTag;
    stringTag.templater = templater;
    return stringTag;
}
html.dom = function (dom, ...values) {
    return getDomTag(dom, values);
};
//# sourceMappingURL=html.js.map