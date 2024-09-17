import { elementInitCheck } from '../../interpolations/attributes/elementInitCheck.js';
/** This is the function that enhances elements such as [class.something] and [style.color] OR it fixes elements that alter innerHTML */
export function afterChildrenBuilt(children, // HTMLCollection // Element[],
subject, ownerSupport) {
    const kids = children;
    const len = kids.length;
    let index = 0;
    while (index < len) {
        const elmMeta = kids[index];
        const attributes = elmMeta.attributes;
        if (!attributes) {
            ++index;
            continue;
        }
        const domElm = elmMeta.domElement;
        elmMeta.attributes.forEach(attribute => {
            const name = attribute[0];
            switch (name) {
                case 'oninit':
                    elementInitCheck(domElm, { added: 0, removed: 0 });
                    break;
                case 'autofocus':
                    domElm.focus();
                    break;
                case 'autoselect':
                    domElm.select();
                    break;
            }
        });
        const children = elmMeta.children;
        if (children) {
            afterChildrenBuilt(children, subject, ownerSupport);
        }
        ++index;
    }
}
//# sourceMappingURL=afterChildrenBuilt.function.js.map