import { SupportContextItem } from './Support.class.js';
import { ContextItem } from './Context.types.js';
export declare function checkArrayValueChange(newValue: unknown, subject: ContextItem): false | 9;
export declare function destroyArray(subject: ContextItem, lastArray: any[]): void;
export declare function checkSimpleValueChange(newValue: unknown, subject: ContextItem): -1 | 6;
export declare function checkTagValueChange(newValue: unknown, subject: SupportContextItem): false | 7 | 8;
