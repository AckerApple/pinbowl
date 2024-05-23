import { interpolateTemplate } from "./interpolateTemplate";
export function interpolateContentTemplates(context, tagSupport, options, children) {
    // counting for animation stagger computing
    const counts = options.counts;
    const clones = [];
    const tagComponents = [];
    const childLength = children.length;
    for (let index = childLength - 1; index >= 0; --index) {
        const child = children[index];
        const { clones: nextClones, tagComponent } = interpolateTemplate(child, context, tagSupport, counts, options);
        clones.push(...nextClones);
        if (tagComponent) {
            tagComponents.push(tagComponent);
            continue;
        }
        if (child.children) {
            for (let index = child.children.length - 1; index >= 0; --index) {
                const subChild = child.children[index];
                // IF <template end /> its a variable to be processed
                if (isRenderEndTemplate(subChild)) {
                    const { tagComponent } = interpolateTemplate(subChild, context, tagSupport, counts, options);
                    if (tagComponent) {
                        tagComponents.push(tagComponent);
                    }
                }
                const { clones: nextClones, tagComponents: nextTagComponent } = interpolateContentTemplates(context, tagSupport, options, subChild.children);
                clones.push(...nextClones);
                tagComponents.push(...nextTagComponent);
            }
        }
    }
    return { clones, tagComponents };
}
function isRenderEndTemplate(child) {
    const isTemplate = child.tagName === 'TEMPLATE';
    return isTemplate &&
        child.getAttribute('interpolate') !== undefined &&
        child.getAttribute('end') !== undefined;
}
//# sourceMappingURL=interpolateContentTemplates.js.map