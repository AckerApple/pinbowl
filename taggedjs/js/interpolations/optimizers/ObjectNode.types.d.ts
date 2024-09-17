import { SpecialDefinition } from "../attributes/processAttribute.function.js";
import { ObjectChildren } from "./LikeObjectElement.type.js";
type ObjectNode = {
    nn: string;
    v?: unknown;
    marker?: Text;
};
export type ObjectText = ObjectNode & {
    tc: string;
    domElement?: Text;
};
export type Attribute = [
    string,
    any?,
    SpecialDefinition?
] | [any];
export type ObjectElement = ObjectNode & {
    at?: Attribute[];
    ch?: ObjectChildren;
    domElement?: HTMLElement;
};
export type DomObjectText = ObjectText & {
    tc: string;
    domElement: Text;
    marker: Text;
};
export type DomObjectElement = ObjectElement & {
    at: [
        string,
        any,
        boolean
    ][];
    domElement: HTMLElement;
    ch?: DomObjectChildren;
    marker?: Text;
};
export type DomObjectChildren = (DomObjectText | DomObjectElement)[];
export {};
