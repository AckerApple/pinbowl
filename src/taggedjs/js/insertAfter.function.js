// Function to insert element after reference element
export function insertAfter(newNode, referenceNode) {
    const parentNode = referenceNode.parentNode;
    parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
//# sourceMappingURL=insertAfter.function.js.map