import { ContextItem } from '../Context.types.js';
export type RegularValue = string | number | undefined | boolean;
export declare function processUpdateRegularValue(value: RegularValue, contextItem: ContextItem): void;
/** Used during updates that were another value/tag first but now simple string */
export declare function processNowRegularValue(value: RegularValue, subject: ContextItem): void;
