import { InsertBefore } from '../../interpolations/InsertBefore.type.js';
import { Tag } from '../Tag.class.js';
import { ValueSubject } from '../../subject/ValueSubject.js';
import { Counts } from '../../interpolations/interpolateTemplate.js';
import { TagSupport } from '../TagSupport.class.js';
import { TemplaterResult } from '../TemplaterResult.class.js';
export type LastArrayItem = {
    tagSupport: TagSupport;
    index: number;
    deleted?: boolean;
};
export type TagArraySubject = ValueSubject<Tag[]> & {
    insertBefore: InsertBefore;
    placeholder?: Text;
    lastArray?: LastArrayItem[];
};
export declare function processTagArray(subject: TagArraySubject, value: (TemplaterResult | Tag)[], // arry of Tag classes
insertBefore: InsertBefore, // <template end interpolate />
ownerSupport: TagSupport, options: {
    counts: Counts;
}): InsertBefore[];
