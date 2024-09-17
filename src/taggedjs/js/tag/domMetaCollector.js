// taggedjs-no-compile
import { htmlInterpolationToDomMeta } from '../interpolations/optimizers/htmlInterpolationToDomMeta.function.js';
import { replacePlaceholders } from '../interpolations/optimizers/replacePlaceholders.function.js';
import { restorePlaceholders } from '../interpolations/optimizers/restorePlaceholders.function.js';
import { isLastRunMatched } from './isLastRunMatched.function.js';
import { getStringsId } from './getStringsId.function.js';
const lastRuns = {};
/** Converts strings & values into dom meta */
export function getDomMeta(strings, values) {
    const stringId = getStringsId(strings);
    const lastRun = lastRuns[stringId];
    const matches = lastRun && isLastRunMatched(strings, values, lastRun);
    if (matches) {
        return lastRun.domMetaMap;
    }
    const domMeta = htmlInterpolationToDomMeta(strings, values);
    const map = replacePlaceholders(domMeta, values.length);
    // Restore any sanitized placeholders in text nodes
    restorePlaceholders(map);
    const template = {
        interpolation: undefined,
        string: undefined,
        strings,
        values,
        domMetaMap: map,
    };
    lastRuns[stringId] = template;
    return map;
}
//# sourceMappingURL=domMetaCollector.js.map