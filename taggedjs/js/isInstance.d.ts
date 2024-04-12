import { SubjectLike } from "./subject/Subject.utils";
import { TemplaterResult } from "./TemplaterResult.class";
export declare function isTagComponent(value?: TemplaterResult | unknown): boolean;
export declare function isTagInstance(tag?: TemplaterResult | unknown): boolean;
export declare function isSubjectInstance(subject?: SubjectLike<any> | any): Boolean;
export declare function isTagArray(value: any): boolean;
