// Function to update the value of x
export function updateBeforeTemplate(value, // value should be casted before calling here
lastFirstChild) {
    const parent = lastFirstChild.parentNode;
    // Insert the new value (never use innerHTML here)
    const textNode = document.createTextNode(value); // never innerHTML
    parent.insertBefore(textNode, lastFirstChild);
    /* remove existing nodes */
    parent.removeChild(lastFirstChild);
    return textNode;
}
export function castTextValue(value) {
    // mimic React skipping to display EXCEPT for true does display on page
    if ([undefined, false, null].includes(value)) { // || value === true
        return '';
    }
    return value;
}
//# sourceMappingURL=updateBeforeTemplate.function.js.map