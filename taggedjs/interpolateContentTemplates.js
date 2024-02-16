import { interpolateTemplate } from "./interpolateTemplate.js";
const templateSearch = new RegExp('\\s*<template interpolate end id="__tagvar(\\d{1,4})"([^>]*)></template>(\\s*)');
/** Returns subscriptions[] that will need to be unsubscribed from when element is destroyed */
export function interpolateContentTemplates(element, // <div><div></div><template tag-wrap="22">...</template></div>
variable, tag, options, children) {
    if (!children || element.tagName === 'TEMPLATE') {
        return []; // done
    }
    const counts = {
        added: 0,
        removed: 0,
    };
    const clones = [];
    const childArray = new Array(...children);
    if (element.tagName === 'TEXTAREA') {
        scanTextAreaValue(element);
    }
    childArray.forEach(child => {
        const nextClones = interpolateTemplate(child, variable, tag, counts, options);
        if (child.tagName === 'TEXTAREA') {
            scanTextAreaValue(child);
        }
        clones.push(...nextClones);
        if (child.children) {
            const nextKids = new Array(...child.children);
            nextKids.forEach(subChild => {
                if (isRenderEndTemplate(subChild)) {
                    interpolateTemplate(subChild, variable, tag, counts, options);
                }
                const nextClones = interpolateContentTemplates(subChild, variable, tag, options, subChild.children);
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