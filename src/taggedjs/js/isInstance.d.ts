import { SubjectLike } from './subject/subject.utils.js';
import { Tag } from './tag/Tag.class.js';
import { TemplaterResult } from './tag/TemplaterResult.class.js';
export declare function isStaticTag(value?: TemplaterResult | Tag | unknown): boolean;
export declare function isTagTemplater(value?: TemplaterResult | unknown): boolean;
export declare function isTagComponent(value?: TemplaterResult | unknown): boolean;
export declare function isTagClass(value?: Tag | unknown): boolean;
export declare function isSubjectInstance(subject?: SubjectLike<any> | any): Boolean;
export declare function isTagArray(value: unknown): boolean;
