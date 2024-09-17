import { ObjectChildren } from "./LikeObjectElement.type.js";
import { DomObjectElement, ObjectElement, ObjectText } from "./ObjectNode.types.js";
export type OneUnparsedHtml = (ObjectElement | ObjectText) & {
    ch?: ObjectChildren;
    at?: any[];
};
export type UnparsedHtml = OneUnparsedHtml[];
export type ParsedHtml = (DomObjectElement | ObjectText)[];
