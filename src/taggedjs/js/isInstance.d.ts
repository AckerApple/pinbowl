import { SubjectLike } from "./subject/Subject.utils";
import { Tag } from "./Tag.class";
import { TemplaterResult } from "./TemplaterResult.class";
export declare function isTagComponent(value?: TemplaterResult | unknown): boolean;
export declare function isTag(value?: TemplaterResult | Tag | unknown): boolean;
export declare function isTagTemplater(value?: TemplaterResult | unknown): boolean;
export declare function isTagClass(value?: Tag | unknown): boolean;
export declare function isSubjectInstance(subject?: SubjectLike<any> | any): Boolean;
export declare function isTagArray(value: any): boolean;
