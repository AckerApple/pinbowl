import { paint, painting } from '../../tag/paint.function.js';
import { renderSupport } from '../../tag/render/renderSupport.function.js';
export function renderTagUpdateArray(supports) {
    ++painting.locks;
    supports.forEach(mapTagUpdate);
    --painting.locks;
    paint();
}
function mapTagUpdate(support) {
    const global = support.subject.global;
    if (!global) {
        return; // while rendering a parent, a child may have been deleted (pinbowl)
    }
    // renderSupport(support)
    renderSupport(global.newest);
}
//# sourceMappingURL=renderTagArray.function.js.map