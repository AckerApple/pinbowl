import { TagSubject } from './Tag.utils';
import { TemplaterResult } from './TemplaterResult.class';
import { Tag } from './Tag.class';
import { InsertBefore } from './Clones.type';
export declare function updateExistingTagComponent(ownerTag: Tag, templater: TemplaterResult, subject: TagSubject, insertBefore: InsertBefore): Tag;
