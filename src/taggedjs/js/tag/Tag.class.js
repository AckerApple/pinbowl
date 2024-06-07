import { ValueTypes } from './ValueTypes.enum.js';
export const variablePrefix = '__tagvar';
export const escapeVariable = '--' + variablePrefix + '--';
export const escapeSearch = new RegExp(escapeVariable, 'g');
export class Tag {
    strings;
    values;
    tagJsType = ValueTypes.tag;
    // present only when an array. Populated by Tag.key()
    memory = {};
    templater;
    constructor(strings, values) {
        this.strings = strings;
        this.values = values;
    }
    /** Used for array, such as array.map(), calls aka array.map(x => html``.key(x)) */
    key(arrayValue) {
        this.memory.arrayValue = arrayValue;
        return this;
    }
    children;
    html(strings, ...values) {
        this.children = { strings, values };
        return this;
    }
}
//# sourceMappingURL=Tag.class.js.map