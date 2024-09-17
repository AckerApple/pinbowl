import { interpolateTemplate } from './interpolateTemplate.js';
export function interpolateContentTemplates(context, support, options, children) {
    // counting for animation stagger computing
    const counts = options.counts;
    const tagComponents = [];
    const childLength = children.length;
    for (let index = childLength - 1; index >= 0; --index) {
        const child = children[index];
        // const tagComponent =
        interpolateTemplate(child, context, support, counts);
        // clones.push(...nextClones)
        /*
        if(tagComponent) {
          tagComponents.push(tagComponent)
          continue
        }
        */
        if (child.children) {
            for (let index = child.children.length - 1; index >= 0; --index) {
                const subChild = child.children[index];
                // IF <template end /> its a variable to be processed
                if (isRenderEndTemplate(subChild)) {
                    // const tagComponent =
                    interpolateTemplate(subChild, context, support, counts);
                    /*
                    if(tagComponent) {
                      tagComponents.push(tagComponent)
                    }
                    */
                }
                const nextTagComponent = interpolateContentTemplates(context, support, options, subChild.children);
                tagComponents.push(...nextTagComponent);
            }
        }
    }
    return tagComponents;
}
function isRenderEndTemplate(child) {
    const isTemplate = child.tagName === 'TEMPLATE';
    return isTemplate &&
        child.getAttribute('interpolate') !== undefined &&
        child.getAttribute('end') !== undefined;
}
//# sourceMappingURL=interpolateContentTemplates.js.map