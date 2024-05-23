import { buildClones } from '../render';
import { afterElmBuild } from './interpolateTemplate';
export function afterInterpolateElement(container, insertBefore, tagSupport, context, options) {
    const clones = buildClones(container, insertBefore);
    if (!clones.length) {
        return clones;
    }
    clones.forEach(clone => afterElmBuild(clone, options, context, tagSupport));
    tagSupport.clones.push(...clones);
    return clones;
}
//# sourceMappingURL=afterInterpolateElement.function.js.map