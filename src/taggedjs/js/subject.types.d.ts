import { InsertBefore } from "./interpolations/Clones.type";
import { TagSupport } from "./tag/TagSupport.class";
import { TemplaterResult } from "./TemplaterResult.class";
import { Template } from "./interpolations/interpolateTemplate";
import { Subject } from "./subject/Subject.class";
import { ValueSubject } from "./subject/ValueSubject";
export type WasTagSubject = Subject<TemplaterResult> & {
    tagSupport?: TagSupport;
};
export type TagSubject = ValueSubject<TemplaterResult> & {
    tagSupport: TagSupport;
};
export type RegularValue = string | number | boolean;
export type DisplaySubject = Subject<RegularValue> & {
    lastValue?: RegularValue;
    clone?: Element | Text | Template;
    insertBefore: InsertBefore;
};
