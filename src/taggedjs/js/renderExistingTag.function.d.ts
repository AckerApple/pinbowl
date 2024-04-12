import { Tag } from './Tag.class';
import { BaseTagSupport } from './TagSupport.class';
import { TemplaterResult } from './TemplaterResult.class';
import { TagSubject } from './Tag.utils';
/** Returns true when rendering owner is not needed. Returns false when rendering owner should occur */
export declare function renderExistingTag(oldestTag: Tag, // existing tag already there
newTemplater: TemplaterResult, tagSupport: BaseTagSupport, subject: TagSubject): Tag;
