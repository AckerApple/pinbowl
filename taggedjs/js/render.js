export function buildClones(temporary, insertBefore) {
    const clones = [];
    const template = temporary.children[0];
    let nextSibling = template.content.firstChild;
    const fragment = document.createDocumentFragment();
    while (nextSibling) {
        const nextNextSibling = nextSibling.nextSibling;
        clones.push(nextSibling);
        fragment.appendChild(nextSibling);
        nextSibling = nextNextSibling;
    }
    if (insertBefore.parentNode) {
        const parentNode = insertBefore.parentNode;
        parentNode.insertBefore(fragment, insertBefore);
    }
    return clones;
}
//# sourceMappingURL=render.js.map