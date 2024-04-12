import { InsertBefore } from './Clones.type';
import { Tag } from './Tag.class';
import { TagSubject } from './Tag.utils';
/** Could be a regular tag or a component. Both are Tag.class */
export declare function processTag(tag: Tag, subject: TagSubject, // could be tag via result.tag
insertBefore: InsertBefore, ownerTag: Tag): void;
export declare function applyFakeTemplater(tag: Tag, ownerTag: Tag, subject: TagSubject): void;
