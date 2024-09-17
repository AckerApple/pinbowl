import { paintInsertBefores } from './tag/paint.function.js';
import { empty } from './tag/ValueTypes.enum.js';
// Function to update the value of x
export function updateBeforeTemplate(value, // value should be casted before calling here
lastFirstChild) {
    const textNode = document.createTextNode(value); // never innerHTML
    paintInsertBefores.push({
        element: textNode,
        relative: lastFirstChild,
    });
    return textNode;
}
export function castTextValue(value) {
    switch (value) {
        case undefined:
        case false:
        case null:
            return empty;
    }
    return value;
}
//# sourceMappingURL=updateBeforeTemplate.function.js.map