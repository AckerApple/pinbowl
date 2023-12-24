import { Context, Tag } from "./Tag.class.js";
import { TemplaterResult } from "./tag.js";
export declare function interpolateTemplate(template: Element & {
    clone?: any;
}, // <template end interpolate /> (will be removed)
context: Context, // variable scope of {`__tagVar${index}`:'x'}
ownerTag: Tag, // Tag class
counts: Counts): void;
export declare function updateBetweenTemplates(value: any, lastFirstChild: Element): Text;
export type Counts = {
    added: 0;
    removed: 0;
};
/** Returns {clones:[], subs:[]} */
export declare function processTagResult(tag: Tag, result: any, // used for recording past and current value
insertBefore: Element, // <template end interpolate />
{ index, counts, }: {
    index?: number;
    counts: Counts;
}): void;
export declare function isTagComponent(value: unknown | TemplaterResult): boolean;
