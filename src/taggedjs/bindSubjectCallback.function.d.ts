import { Tag } from "./Tag.class.js";
export declare function bindSubjectCallback(value: (...args: any[]) => any, tag: Tag): {
    (element: Element, args: any[]): Promise<string> | undefined;
    tagFunction: (...args: any[]) => any;
};
