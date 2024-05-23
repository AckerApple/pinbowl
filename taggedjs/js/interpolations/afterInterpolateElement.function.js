import { buildClones } from '../render';
import { afterElmBuild } from './interpolateTemplate';
export function afterInterpolateElement(container, insertBefore, tagSupport, context, options) {
    const clones = buildClones(container, insertBefore);
    if (!clones.length) {
        return clones;
    }
    for (let index = clones.length - 1; index >= 0; --index) {
        const clone = clones[index];
        afterElmBuild(clone, options, context, tagSupport);
        tagSupport.clones.push(clone);
    }
    return clones;
}
//# sourceMappingURL=afterInterpolateElement.function.js.map