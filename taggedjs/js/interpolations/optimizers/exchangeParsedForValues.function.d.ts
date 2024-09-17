import { ParsedHtml } from "./htmlInterpolationToDomMeta.function.js";
import { ObjectElement, ObjectText } from "./ObjectNode.types.js";
export type ValuePos = (elements: any) => ([any, string | number] | any[]);
export type ObjectChildren = (ObjectText | ObjectElement)[];
export type DomMetaMap = ParsedHtml;
export type LikeObjectChildren = LikeObjectElement[];
type LikeObjectElement = {
    nn: string;
    tc?: string;
    v?: any;
    at?: any[];
    ch?: LikeObjectElement[];
    domElement?: any;
};
export {};
