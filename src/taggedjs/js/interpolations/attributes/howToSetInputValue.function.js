import { paintContent } from "../../tag/paint.function.js";
export function howToSetInputValue(element, name, value) {
    paintContent.push(() => {
        if (value === undefined || value === false || value === null) {
            element.removeAttribute(name);
            return;
        }
        element.setAttribute(name, value);
    });
}
//# sourceMappingURL=howToSetInputValue.function.js.map