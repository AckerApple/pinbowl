import { subscribeToTemplate } from '../../interpolations/subscribeToTemplate.function.js';
import { buildBeforeElement } from '../buildBeforeElement.function.js';
import { paintAppends } from '../paint.function.js';
import { checkTagValueChange } from '../index.js';
export function processReplaceTagResult(support, counts, contextItem) {
    contextItem.checkValueChange = checkTagValueChange;
    const ph = contextItem.placeholder;
    const result = buildBeforeElement(support, undefined, // element for append child
    ph, // placeholder
    { counts });
    const subs = result.subs;
    for (const sub of subs) {
        subscribeToTemplate(sub);
    }
    return support;
}
export function processFirstTagResult(support, counts, appendTo) {
    let appendIndex = paintAppends.length;
    const result = buildBeforeElement(support, appendTo, undefined, { counts });
    for (const dom of result.dom) {
        if (dom.domElement) {
            paintAppends.splice(appendIndex++, 0, {
                element: dom.domElement,
                relative: appendTo,
            });
        }
        if (dom.marker) {
            paintAppends.splice(appendIndex++, 0, {
                element: dom.marker,
                relative: appendTo,
            });
        }
    }
    const subs = result.subs;
    for (const sub of subs) {
        subscribeToTemplate(sub);
    }
    return support;
}
//# sourceMappingURL=processTagResult.function.js.map