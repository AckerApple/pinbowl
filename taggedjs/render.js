import { interpolateElement } from "./interpolateElement.js";
export function buildItemTagMap(tag, template, // {string, context}
insertBefore) {
    const temporary = document.createElement('div');
    temporary.id = 'tag-temp-holder';
    // render content with a first child that we can know is our first element
    temporary.innerHTML = '<div></div>' + template.string;
    const context = tag.update();
    interpolateElement(temporary, context, tag);
    const clones = buildClones(temporary, insertBefore);
    tag.clones.push(...clones);
    return clones;
}
function buildClones(temporary, insertBefore) {
    const clones = [];
    const templateClone = temporary.children[0];
    const sibling = templateClone; // a div we added
    let nextSibling = sibling.nextSibling;
    temporary.removeChild(templateClone); // remove the div
    while (nextSibling) {
        const nextNextSibling = nextSibling.nextSibling;
        buildSibling(nextSibling, insertBefore);
        clones.push(nextSibling);
        nextSibling = nextNextSibling;
    }
    return clones;
}
function buildSibling(nextSibling, insertBefore) {
    insertBefore.parentNode.insertBefore(nextSibling, insertBefore);
}
//# sourceMappingURL=render.js.map