import { interpolateTemplate } from "./interpolateTemplate.js";
/** Returns subscriptions[] that will need to be unsubscribed from when element is destroyed */
export function interpolateContentTemplates(element, variable, ownerTag) {
    if (!element.children || element.tagName === 'TEMPLATE') {
        return; // done
    }
    const counts = {
        added: 0,
        removed: 0,
    };
    const children = new Array(...element.children);
    children.forEach((child, index) => {
        interpolateChild(child, index, children);
        if (child.children) {
            const nextKids = new Array(...child.children);
            nextKids.forEach((subChild, index) => {
                if (isRenderEndTemplate(subChild)) {
                    interpolateChild(subChild, index, nextKids);
                }
                interpolateContentTemplates(subChild, variable, ownerTag);
            });
        }
    });
    function interpolateChild(child, index, children) {
        children.forEach((child, subIndex) => {
            if (subIndex < index) {
                return; // too low
            }
            if (child.tagName !== 'TEMPLATE') {
                return; // not a template
            }
            if (child.getAttribute('interpolate') === undefined || child.getAttribute('end') === undefined) {
                return; // not a rendering template
            }
            return child;
        });
        interpolateTemplate(child, variable, ownerTag, counts);
    }
    return;
}
function isRenderEndTemplate(child) {
    const isTemplate = child.tagName === 'TEMPLATE';
    return isTemplate &&
        child.getAttribute('interpolate') !== undefined &&
        child.getAttribute('end') !== undefined;
}
//# sourceMappingURL=interpolateContentTemplates.js.map