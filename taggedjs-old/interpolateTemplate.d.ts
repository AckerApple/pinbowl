import { Context, ElementBuildOptions, Tag } from "./Tag.class.js";
import { InterpolateOptions } from "./interpolateElement.js";
export declare function interpolateTemplate(template: Template, // <template end interpolate /> (will be removed)
context: Context, // variable scope of {`__tagVar${index}`:'x'}
ownerTag: Tag, // Tag class
counts: Counts, // {added:0, removed:0}
{ forceElement }: InterpolateOptions): void;
export type Template = Element & {
    clone: any;
};
export declare function updateBetweenTemplates(value: any, lastFirstChild: Element): Text;
export type Counts = {
    added: number;
    removed: number;
};
/** Returns {clones:[], subs:[]} */
export declare function processTagResult(tag: Tag, result: any, // used for recording past and current value
insertBefore: Element, // <template end interpolate />
{ index, counts, forceElement, }: {
    index?: number;
    counts: Counts;
    forceElement?: boolean;
}): void;
export declare function afterElmBuild(elm: Element | ChildNode, options: ElementBuildOptions): void;
