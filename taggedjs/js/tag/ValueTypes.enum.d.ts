export declare const empty = "";
export declare enum ImmutableTypes {
    string = "string",
    number = "number",
    boolean = "boolean",
    undefined = "undefined"
}
export declare enum BasicTypes {
    function = "function",
    date = "date",
    unknown = "unknown",
    object = "object"
}
export type ValueType = [string];
type ValueTypeObject = {
    tag: ValueType;
    dom: ValueType;
    templater: ValueType;
    tagComponent: ValueType;
    tagArray: ValueType;
    subject: ValueType;
    tagJsSubject: ValueType;
    renderOnce: ValueType;
    stateRender: ValueType;
    version: number;
};
/** Used as direct memory comparisons, the strings are never compared, just the array */
export declare const ValueTypes: ValueTypeObject;
export {};
