// taggedjs-no-compile
import { ValueTypes } from './ValueTypes.enum.js';
import { getSupportInCycle } from './getSupportInCycle.function.js';
export const variablePrefix = ':tagvar';
export const variableSuffix = ':';
export function getStringTag(strings, values) {
    const tag = {
        values,
        ownerSupport: getSupportInCycle(),
        tagJsType: ValueTypes.tag,
        strings: strings,
        key(arrayValue) {
            tag.arrayValue = arrayValue;
            return tag;
        },
        html: function html(strings, values) {
            tag.children = { strings, values };
            return tag;
        }
    };
    return tag;
}
export function getDomTag(dom, values) {
    const tag = {
        values,
        ownerSupport: getSupportInCycle(),
        dom,
        tagJsType: ValueTypes.dom,
        key: function keyFun(arrayValue) {
            tag.arrayValue = arrayValue;
            return tag;
        },
        html: {
            dom: function dom(dom, // ObjectChildren
            values) {
                tag.children = { dom: dom, values };
                return tag;
            }
        }
    };
    return tag;
}
//# sourceMappingURL=Tag.class.js.map