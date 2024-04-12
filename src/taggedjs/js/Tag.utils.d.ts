import { InsertBefore } from "./Clones.type";
import { Tag } from "./Tag.class";
import { TemplaterResult } from "./TemplaterResult.class";
import { Template } from "./interpolateTemplate";
import { Subject } from "./subject/Subject.class";
import { ValueSubject } from "./subject/ValueSubject";
export type TagSubject = Subject<TemplaterResult> & {
    tag?: Tag;
};
type RegularValue = string | number | boolean;
export type DisplaySubject = Subject<RegularValue> & {
    lastValue?: RegularValue;
    clone?: Element | Text | Template;
    insertBefore: InsertBefore;
};
export declare function getSubjectFunction(value: any, tag: Tag): ValueSubject<import("./bindSubjectCallback.function").Callback>;
export {};
