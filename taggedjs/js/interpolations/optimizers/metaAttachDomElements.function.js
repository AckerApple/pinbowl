// taggedjs-no-compile
import { isSubjectInstance } from "../../isInstance.js";
import { paintAppends } from "../../tag/paint.function.js";
import { empty } from "../../tag/ValueTypes.enum.js";
import { processAttribute } from "../attributes/processAttribute.function.js";
import { processFirstSubjectValue } from "../../tag/update/processFirstSubjectValue.function.js";
// ??? TODO: This could be done within exchangeParsedForValues to reduce loops
export function attachDomElement(nodes, scope, support, counts, // used for animation stagger computing
owner, subs = []) {
    const x = document.createElement('div');
    const dom = [];
    for (const node of nodes) {
        const newNode = {}; // DomObjectText
        dom.push(newNode);
        const value = node.v;
        const isNum = !isNaN(value);
        if (isNum) {
            const marker = newNode.marker = node.marker || document.createTextNode(empty); // textNode.cloneNode(false) as Text
            if (owner) {
                paintAppends.push({
                    relative: owner,
                    element: marker,
                });
            }
            const subject = scope[value];
            subject.global.placeholder = marker;
            // delete (node as any).marker // delete so that the marker is not destroyed with tag
            const subVal = subject.value;
            if (isSubjectInstance(subVal)) {
                subs.push({
                    // fragment: owner,
                    insertBefore: marker,
                    appendTo: owner,
                    subject: subVal,
                    support, // ownerSupport,
                    counts,
                    contextItem: subject,
                });
                continue;
            }
            processFirstSubjectValue(subject.value, subject, support, {
                counts: { ...counts },
            }, owner);
            continue;
        }
        if (node.nn === 'text') {
            const textNode = newNode;
            const string = textNode.tc = node.tc;
            // PARSE things like &nbsp; and <!-- -->
            // const newString = string // domParseString(string)
            x.innerHTML = string;
            const domElement = textNode.domElement = document.createTextNode(x.innerText);
            if (owner) {
                paintAppends.push({
                    element: domElement,
                    relative: owner,
                });
            }
            continue;
        }
        const domElement = newNode.domElement = document.createElement(node.nn);
        // attributes that may effect style, come first
        if (node.at) {
            node.at.map(attr => processAttribute({ name: attr[0], value: attr[1], isSpecial: attr[2] }, domElement, support));
        }
        if (owner) {
            paintAppends.push({
                element: domElement,
                relative: owner,
            });
        }
        if (node.ch) {
            newNode.ch = attachDomElement(node.ch, scope, support, counts, domElement, subs).dom;
        }
    }
    return { subs, dom };
}
// parse things like &nbsp; and <!-- -->
function domParseString(string) {
    const text = new DOMParser().parseFromString(string, 'text/html');
    return getLeadingSpaces(string) + text.documentElement.textContent;
}
function getLeadingSpaces(str) {
    const match = str.match(/^\s+/);
    return match ? match[0] : '';
}
//# sourceMappingURL=metaAttachDomElements.function.js.map