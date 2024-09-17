import { HowToSet } from './howToSetInputValue.function.js';
import { AnySupport } from '../../tag/Support.class.js';
import { Context, ContextItem } from '../../tag/Context.types.js';
type TagVarIdNum = {
    tagJsVar: number;
};
export type SpecialDefinition = boolean | 'class' | 'style' | 'oninit' | 'autofocus' | 'autoselect';
/** Sets attribute value, subscribes to value updates  */
export declare function processAttribute(values: unknown[], attrName: string | TagVarIdNum, element: Element, support: AnySupport, howToSet: HowToSet, //  = howToSetInputValue
context: Context, value?: string | null | TagVarIdNum, isSpecial?: SpecialDefinition): void;
export declare function updateNameOnlyAttrValue(values: unknown[], attrValue: string | boolean | Record<string, any>, lastValue: string | Record<string, any> | undefined, element: Element, ownerSupport: AnySupport, howToSet: HowToSet, context: Context): void;
export declare function processNameOnlyAttrValue(values: unknown[], attrValue: string | boolean | Record<string, any>, element: Element, ownerSupport: AnySupport, howToSet: HowToSet, context: Context): void;
export declare function processAttributeEmit(newAttrValue: any, attrName: string, subject: ContextItem, element: Element, support: AnySupport, howToSet: HowToSet, isSpecial?: SpecialDefinition): any;
export type NoDisplayValue = false | null | undefined;
type DisplayValue = ((...args: unknown[]) => unknown) | string | boolean;
export declare function processAttributeSubjectValue(newAttrValue: DisplayValue | NoDisplayValue, element: Element, attrName: string, isSpecial: SpecialDefinition | undefined, howToSet: HowToSet, support: AnySupport): void;
export declare function processTagCallbackFun(subject: ContextItem, newAttrValue: any, support: AnySupport, attrName: string, element: Element): any;
export declare function isNoDisplayValue(attrValue: any): boolean;
export {};
