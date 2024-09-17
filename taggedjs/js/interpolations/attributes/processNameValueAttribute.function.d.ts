import { HowToSet } from './howToSetInputValue.function.js';
import { TagGlobal } from '../../tag/TemplaterResult.class.js';
import { SpecialDefinition } from './processAttribute.function.js';
import { ContextItem } from '../../tag/Context.types.js';
import { AnySupport } from '../../tag/Support.class.js';
export declare function processDynamicNameValueAttribute(attrName: string, value: any | TagGlobal, contextItem: ContextItem, element: Element, howToSet: HowToSet, support: AnySupport, isSpecial?: SpecialDefinition): any;
export declare function processNonDynamicAttr(attrName: string, value: string, element: Element, howToSet: HowToSet, isSpecial?: SpecialDefinition): void;
