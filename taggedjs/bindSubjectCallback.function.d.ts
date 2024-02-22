import { Tag } from "./Tag.class.js";
type Callback = (...args: any[]) => any & {
    isChildOverride?: true;
};
export declare function bindSubjectCallback(value: Callback, tag: Tag): Callback;
export declare function runTagCallback(value: Callback, tag: Tag, bindTo: unknown, args: any[]): Promise<string> | undefined;
export {};
