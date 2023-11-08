// Does not require money symbol (more like React)
//export const interpolateReplace = /\$*{((?:[^{}]|(?:\{[^{}]*\}))*?)}/g
export const interpolateReplace = /(?:<[^>]*>)|\$*{((?:[^{}]|(?:\{[^{}]*\}))*?)}/g;

/** replaces ${x} with <template id="x-start"></template><template id="x-end"></template> */
export function interpolateToTemplates(template) {
  const keys = [];
  const string = template.replace(interpolateReplace, (match, expression) => {
    if (match.startsWith('<')) {
      // If the match is an HTML tag, don't replace
      return match;
    }
    const id = expression.trim();
    keys.push(id);
    return `<template interpolate end id="${id}"></template>`;
  });

  return { string, keys };
}
