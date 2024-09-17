import { variableSuffix, variablePrefix } from "../../tag/Tag.class.js";
import { ImmutableTypes } from "../../tag/ValueTypes.enum.js";
export const safeVar = '__safeTagVar';
export function restorePlaceholders(elements) {
    elements.forEach(traverseAndRestore);
}
const safeReplacer = /__safeTagVar(\d+)/g;
function traverseAndRestore(element) {
    if (element.at) {
        element.at = element.at ? element.at.map(attr => {
            if (attr.length === 1) {
                return attr;
            }
            const [, value] = attr;
            if (typeof value === ImmutableTypes.string && value.startsWith(safeVar)) {
                const index = parseInt(value.replace(safeVar, ''), 10);
                attr[1] = variablePrefix + index + variableSuffix;
            }
            return attr;
        }) : [];
    }
    if (element.ch) {
        const children = element.ch;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.nn === 'text') {
                if (typeof child.tc !== ImmutableTypes.string) {
                    return;
                }
                child.tc = child.tc.replace(safeReplacer, (_match, index) => variablePrefix + index + variableSuffix);
            }
            traverseAndRestore(child);
        }
        // Remove empty children array
        if (children.length === 0) {
            delete element.ch;
        }
    }
}
//# sourceMappingURL=restorePlaceholders.function.js.map