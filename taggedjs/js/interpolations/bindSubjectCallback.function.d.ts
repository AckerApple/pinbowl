/** File largely responsible for reacting to element events, such as onclick */
import { TagSupport } from "../tag/TagSupport.class";
export type Callback = (...args: any[]) => any & {
    isChildOverride?: true;
};
export declare function bindSubjectCallback(value: Callback, tagSupport: TagSupport): Callback;
export declare function runTagCallback(value: Callback, tagSupport: TagSupport, bindTo: unknown, args: any[]): Promise<string> | "no-data-ever";
