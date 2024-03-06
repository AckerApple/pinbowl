import { interpolateTemplate } from "./interpolateTemplate.js";
const templateSearch = new RegExp('\\s*<template interpolate end id="__tagvar(\\d{1,4})"([^>]*)></template>(\\s*)');
/** Returns subscriptions[] that will need to be unsubscribed from when element is destroyed */
export function interpolateContentTemplates(element, context, tag, options, children) {
    if (!children || element.tagName === 'TEMPLATE') {
        return []; // done
    }
    // counting for animation stagger computing
    const counts = options.counts;
    const clones = [];
    const childArray = new Array(...children);
    if (element.tagName === 'TEXTAREA') {
        scanTextAreaValue(element);
    }
    childArray.forEach(child => {
        const nextClones = interpolateTemplate(child, context, tag, counts, options);
        if (child.tagName === 'TEXTAREA') {
            scanTextAreaValue(child);
        }
        clones.push(...nextClones);
        if (child.children) {
            const nextKids = new Array(...child.children);
            nextKids.forEach((subChild, index) => {
                if (isRenderEndTemplate(subChild)) {
                    interpolateTemplate(subChild, context, tag, counts, options);
                }
                const nextClones = interpolateContentTemplates(subChild, context, tag, options, subChild.children);
                clones.push(...nextClones);
            });
        }
    });
    return clones;
}
function isRenderEndTemplate(child) {
    const isTemplate = child.tagName === 'TEMPLATE';
    return isTemplate &&
        child.getAttribute('interpolate') !== undefined &&
        child.getAttribute('end') !== undefined;
}
function scanTextAreaValue(textarea) {
    const value = textarea.value;
    if (value.search(templateSearch) >= 0) {
        const match = value.match(/__tagvar(\d{1,4})/);
        const result = match ? match[0] : '';
        const token = '{' + result + '}';
        // textarea.value = token
        textarea.value = '';
        textarea.setAttribute('textVarValue', token);
    }
}
//# sourceMappingURL=interpolateContentTemplates.js.map