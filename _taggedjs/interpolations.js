export const interpolateReplace = /(?:<[^>]*>)|({__tagVar[^}]+})/g;
/** replaces ${x} with <template id="x-start"></template><template id="x-end"></template> */
export function interpolateToTemplates(template) {
    const keys = [];
    const string = template.replace(interpolateReplace, (match, expression) => {
        if (match.startsWith('<')) {
            // If the match is an HTML tag, don't replace
            return match;
        }
        const noBraces = expression.substring(1, expression.length - 1);
        const id = noBraces;
        keys.push(id);
        return `<template interpolate end id="${id}"></template>`;
    });
    return { string, keys };
}
//# sourceMappingURL=interpolations.js.map