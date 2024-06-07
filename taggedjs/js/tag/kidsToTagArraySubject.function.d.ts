import { Tag } from './Tag.class.js';
import { ValueSubject } from '../subject/ValueSubject.js';
import { TagChildrenInput } from './tag.utils.js';
import { TemplaterResult } from './TemplaterResult.class.js';
export declare function kidsToTagArraySubject(children: TagChildrenInput | undefined, templaterResult: TemplaterResult): ValueSubject<Tag[]>;
