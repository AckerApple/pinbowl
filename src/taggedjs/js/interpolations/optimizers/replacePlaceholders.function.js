// taggedjs-no-compile
import { variableSuffix, variablePrefix } from "../../tag/Tag.class.js";
import { ImmutableTypes } from "../../tag/ValueTypes.enum.js";
const placeholderRegex = new RegExp(variablePrefix + '(\\d+)' + variableSuffix, 'g');
const ch = 'ch'; // short for children
export function replacePlaceholders(dom, valueCount, valuePositions = [], currentTail = []) {
    const elements = dom;
    for (let i = 0; i < elements.length; i++) {
        const loopTail = [...currentTail, i];
        const element = elements[i];
        if (element.at) {
            const attrs = element.at;
            element.at = processAttributes(attrs, valueCount);
        }
        if (element.ch) {
            const children = element.ch;
            const innerLoopTail = [...loopTail, ch];
            element.ch = replacePlaceholders(children, valueCount, valuePositions, innerLoopTail);
        }
        i = examineChild(element, valueCount, elements, i);
    }
    return elements;
}
function examineChild(child, valueCount, children, index) {
    if (child.nn !== 'text') {
        return index;
    }
    const textChild = child;
    let textContent = textChild.tc;
    if (typeof textContent !== ImmutableTypes.string) {
        return index;
    }
    let match;
    while ((match = placeholderRegex.exec(textContent)) !== null) {
        const secondMatch = match[1];
        const wIndex = parseInt(secondMatch, 10);
        const examine = !isNaN(wIndex) && wIndex < valueCount;
        if (examine) {
            const varContent = variablePrefix + wIndex + variableSuffix;
            const after = textContent.slice(match.index + varContent.length);
            children.splice(index, 1, ...[{
                    nn: 'text',
                    v: wIndex
                }]);
            textContent = after;
            placeholderRegex.lastIndex = 0; // Reset regex index due to split
        }
    }
    textChild.tc = textContent;
    return index;
}
function processAttributes(attributes, valueCount) {
    return attributes.map(attrSet => {
        const [key, value, isSpecial] = attrSet;
        if (key.startsWith(variablePrefix)) {
            const index = parseInt(key.replace(variablePrefix, ''), 10);
            if (!isNaN(index) && index < valueCount) {
                return [{ tagJsVar: index }];
            }
        }
        if (typeof value === ImmutableTypes.string && value.startsWith(variablePrefix)) {
            const index = parseInt(value.replace(variablePrefix, ''), 10);
            if (!isNaN(index) && index < valueCount) {
                return [key, { tagJsVar: index }, isSpecial];
            }
        }
        return attrSet;
    });
}
//# sourceMappingURL=replacePlaceholders.function.js.map