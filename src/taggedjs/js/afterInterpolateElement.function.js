import { buildClones } from './render';
import { afterElmBuild } from './interpolations/interpolateTemplate';
export function afterInterpolateElement(container, insertBefore, tagSupport, 
// preClones: Clones,
context, options) {
    const clones = buildClones(container, insertBefore);
    if (!clones.length) {
        return clones;
    }
    clones.forEach(clone => afterElmBuild(clone, options, context, tagSupport));
    tagSupport.clones.push(...clones);
    return clones;
}
//# sourceMappingURL=afterInterpolateElement.function.js.map