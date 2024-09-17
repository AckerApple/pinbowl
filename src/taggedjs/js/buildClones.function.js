export function buildClones(fragment, template) {
    const clones = [];
    let nextSibling = template.content.firstChild;
    while (nextSibling) {
        const nextNextSibling = nextSibling.nextSibling;
        fragment.appendChild(nextSibling);
        clones.push(nextSibling);
        nextSibling = nextNextSibling;
    }
    return clones;
}
//# sourceMappingURL=buildClones.function.js.map