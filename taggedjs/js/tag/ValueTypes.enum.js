export const empty = '';
export var ImmutableTypes;
(function (ImmutableTypes) {
    ImmutableTypes["string"] = "string";
    ImmutableTypes["number"] = "number";
    ImmutableTypes["boolean"] = "boolean";
    ImmutableTypes["undefined"] = "undefined";
})(ImmutableTypes || (ImmutableTypes = {}));
export var BasicTypes;
(function (BasicTypes) {
    BasicTypes["function"] = "function";
    BasicTypes["date"] = "date";
    BasicTypes["unknown"] = "unknown";
    BasicTypes["object"] = "object";
})(BasicTypes || (BasicTypes = {}));
const version = Date.now();
/** Used as direct memory comparisons, the strings are never compared, just the array */
export const ValueTypes = {
    tag: ['html'], // html'' aka StringTag | DomTag
    dom: ['dom'], // compiled version of html''
    templater: ['templater'],
    tagComponent: ['tagComponent'],
    tagArray: ['tagArray'],
    subject: ['subject'],
    tagJsSubject: ['tagJsSubject'],
    renderOnce: ['renderOnce'],
    stateRender: ['stateRender'],
    version,
};
//# sourceMappingURL=ValueTypes.enum.js.map