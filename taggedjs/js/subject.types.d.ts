import { InsertBefore } from "./Clones.type";
import { TagSupport } from "./TagSupport.class";
import { TemplaterResult } from "./TemplaterResult.class";
import { Template } from "./interpolations/interpolateTemplate";
import { Subject } from "./subject/Subject.class";
export type WasTagSubject = Subject<TemplaterResult> & {
    tagSupport?: TagSupport;
};
export type TagSubject = Subject<TemplaterResult> & {
    tagSupport: TagSupport;
};
type RegularValue = string | number | boolean;
export type DisplaySubject = Subject<RegularValue> & {
    lastValue?: RegularValue;
    clone?: Element | Text | Template;
    insertBefore: InsertBefore;
};
export {};
