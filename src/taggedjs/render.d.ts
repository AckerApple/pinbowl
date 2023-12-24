import { Context, Tag } from "./Tag.class.js";
export declare function buildItemTagMap(tag: Tag, template: {
    string: string;
    context: Context;
}, // {string, context}
insertBefore: Element): (ChildNode | Element)[];
