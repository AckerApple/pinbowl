export function setTagPlaceholder(global) {
    const insertBefore = global.insertBefore;
    return global.placeholder = swapInsertBefore(insertBefore);
}
export function swapInsertBefore(insertBefore) {
    const placeholder = document.createTextNode('');
    const parentNode = insertBefore.parentNode;
    parentNode.insertBefore(placeholder, insertBefore);
    parentNode.removeChild(insertBefore);
    return placeholder;
}
//# sourceMappingURL=setTagPlaceholder.function.js.map