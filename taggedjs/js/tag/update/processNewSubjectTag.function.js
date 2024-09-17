import { subscribeToTemplate } from '../../interpolations/subscribeToTemplate.function.js';
import { checkTagValueChange } from '../checkDestroyPrevious.function.js';
import { buildBeforeElement } from '../buildBeforeElement.function.js';
import { paintAppends } from '../paint.function.js';
import { newSupportByTemplater } from './processTag.function.js';
export function processNewSubjectTag(templater, ownerSupport, // owner
subject, // could be tag via result.tag
appendTo) {
    subject.checkValueChange = checkTagValueChange;
    const support = newSupportByTemplater(templater, ownerSupport, subject);
    support.ownerSupport = ownerSupport;
    const result = buildBeforeElement(support, appendTo, undefined, { counts: { added: 0, removed: 0 } });
    for (const dom of result.dom) {
        if (dom.marker) {
            paintAppends.push({
                element: dom.marker,
                relative: appendTo, // ph.parentNode as Element,
            });
        }
        if (dom.domElement) {
            paintAppends.push({
                element: dom.domElement,
                relative: appendTo, // ph.parentNode as Element,
            });
        }
    }
    let index = -1;
    const length = result.subs.length - 1;
    //++painting.locks
    while (index++ < length) {
        const sub = result.subs[index];
        subscribeToTemplate(sub);
    }
    return support;
}
//# sourceMappingURL=processNewSubjectTag.function.js.map