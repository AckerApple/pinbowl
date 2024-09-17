import { textNode } from './textNode.js';
export function setTagPlaceholder(global) {
    const insertBefore = global.insertBefore;
    return global.placeholder = swapInsertBefore(insertBefore);
}
export function swapInsertBefore(insertBefore) {
    const placeholder = textNode.cloneNode(false);
    const parentNode = insertBefore.parentNode;
    parentNode.insertBefore(placeholder, insertBefore);
    parentNode.removeChild(insertBefore);
    return placeholder;
}
//# sourceMappingURL=setTagPlaceholder.function.js.map