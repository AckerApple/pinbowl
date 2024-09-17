import { paint, painting } from './paint.function.js';
import { processUpdateContext } from './processUpdateContext.function.js';
export function updateSupportBy(olderSupport, newerSupport) {
    const global = olderSupport.subject.global;
    const context = global.context;
    updateSupportValuesBy(olderSupport, newerSupport);
    ++painting.locks;
    processUpdateContext(olderSupport, context);
    --painting.locks;
    paint();
}
export function updateSupportValuesBy(olderSupport, newerSupport) {
    const tempTag = (newerSupport.templater.tag || newerSupport.templater);
    const values = newerSupport.templater.values || tempTag.values;
    const tag = olderSupport.templater.tag;
    tag.values = values;
}
//# sourceMappingURL=updateSupportBy.function.js.map