import { TagSupport } from "./getTagSupport.js";
import { ValueSubject } from "./ValueSubject.js";
import { Subject } from "./Subject.js";
import { Tag } from "./Tag.class.js";
import { TemplaterResult } from "./templater.utils.js";
export type TagSubject = Subject<TemplaterResult> & {
    tagSupport?: TagSupport;
    tag?: Tag;
    clone?: Element;
};
export declare function getSubjectFunction(value: any, tag: Tag): ValueSubject<unknown>;
export declare function setValueRedraw(templater: TemplaterResult, // latest tag function to call for rendering
existing: TagSubject, ownerTag: Tag): void;
