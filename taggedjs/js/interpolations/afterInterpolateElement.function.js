import { buildClones } from '../buildClones.function.js';
import { afterElmBuild } from './interpolateTemplate.js';
export function afterInterpolateElement(container, template, support, context, options) {
    const clones = buildClones(container, template);
    if (!clones.length) {
        return clones;
    }
    const global = support.subject.global;
    for (let index = clones.length - 1; index >= 0; --index) {
        const clone = clones[index];
        afterElmBuild(clone, options, context, support);
    }
    global.clones.push(...clones);
    return clones;
}
//# sourceMappingURL=afterInterpolateElement.function.js.map