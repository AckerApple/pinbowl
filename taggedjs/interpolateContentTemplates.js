import { interpolateTemplate } from "./interpolateTemplate.js";
/** Returns subscriptions[] that will need to be unsubscribed from when element is destroyed */
export function interpolateContentTemplates(element, variable, tag, options) {
    if (!element.children || element.tagName === 'TEMPLATE') {
        return []; // done
    }
    const counts = {
        added: 0,
        removed: 0,
    };
    const clones = [];
    const children = new Array(...element.children);
    children.forEach((child, index) => {
        const nextClones = interpolateChild(child, index, children, options, variable, tag, counts);
        clones.push(...nextClones);
        if (child.children) {
            const nextKids = new Array(...child.children);
            nextKids.forEach((subChild, index) => {
                if (isRenderEndTemplate(subChild)) {
                    interpolateChild(subChild, index, nextKids, options, variable, tag, counts);
                }
                const nextClones = interpolateContentTemplates(subChild, variable, tag, options);
                clones.push(...nextClones);
            });
        }
    });
    return clones;
}
function interpolateChild(child, index, children, options, variable, tag, counts) {
    /*
    children.forEach((child, subIndex) => {
      if ( subIndex < index ) {
        return // too low
      }
  
      if ( child.tagName!=='TEMPLATE' ) {
        return // not a template
      }
    
      if ( child.getAttribute('interpolate')===undefined || child.getAttribute('end') === undefined ) {
        return // not a rendering template
      }
  
      return child
    })
    */
    const clones = interpolateTemplate(child, variable, tag, counts, options);
    return clones;
}
function isRenderEndTemplate(child) {
    const isTemplate = child.tagName === 'TEMPLATE';
    return isTemplate &&
        child.getAttribute('interpolate') !== undefined &&
        child.getAttribute('end') !== undefined;
}
//# sourceMappingURL=interpolateContentTemplates.js.map