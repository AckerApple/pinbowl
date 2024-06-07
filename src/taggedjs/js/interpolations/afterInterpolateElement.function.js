import { buildClones } from '../render.js';
import { afterElmBuild } from './interpolateTemplate.js';
export function afterInterpolateElement(container, insertBefore, tagSupport, context, options) {
    const clones = buildClones(container, insertBefore);
    if (!clones.length) {
        return clones;
    }
    for (let index = clones.length - 1; index >= 0; --index) {
        const clone = clones[index];
        afterElmBuild(clone, options, context, tagSupport);
        tagSupport.global.clones.push(clone);
    }
    return clones;
}
//# sourceMappingURL=afterInterpolateElement.function.js.map