import { attachDomElements } from '../interpolations/optimizers/attachDomElements.function.js';
import { checkSimpleValueChange } from './index.js';
import { getDomMeta } from './domMetaCollector.js';
import { ValueTypes } from './ValueTypes.enum.js';
import { painting } from './paint.function.js';
/** Function that kicks off actually putting tags down as HTML elements */
export function buildBeforeElement(support, element, insertBefore, options) {
    const global = support.subject.global;
    global.oldest = support;
    global.newest = support;
    ++painting.locks;
    const result = getHtmlDomMeta(support, options, element, insertBefore);
    global.htmlDomMeta = result.dom;
    --painting.locks;
    // return fragment
    return result;
}
function getHtmlDomMeta(support, options = {
    counts: { added: 0, removed: 0 },
}, appendTo, insertBefore) {
    const domMeta = loadDomMeta(support);
    const thisTag = support.templater.tag;
    const values = thisTag.values;
    const context = [];
    const global = support.subject.global;
    global.context = context;
    const result = attachDomElements(domMeta, values, support, options.counts, context, 0, appendTo, insertBefore);
    return result;
}
function loadDomMeta(support) {
    const templater = support.templater;
    const thisTag = templater.tag; // || templater
    if (thisTag.tagJsType === ValueTypes.dom) {
        return thisTag.dom;
    }
    return getDomMeta(thisTag.strings, thisTag.values);
}
export function addOneContext(value, context, withinOwnerElement) {
    const contextItem = {
        value,
        checkValueChange: checkSimpleValueChange,
        withinOwnerElement,
    };
    context.push(contextItem);
    return contextItem;
}
//# sourceMappingURL=buildBeforeElement.function.js.map