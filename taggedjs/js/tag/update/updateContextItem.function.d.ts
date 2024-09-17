import { TemplateValue } from './processFirstSubject.utils.js';
import { ContextItem } from '../Tag.class.js';
import { TypedValue } from '../getValueType.function.js';
import { AnySupport } from '../Support.class.js';
/** return boolean indicated if render took place */
export declare function updateContextItem(contextItem: ContextItem, value: TemplateValue, ownerSupport: AnySupport, valueType: TypedValue): boolean;
export declare function updateOneContextValue(wasUpdated: boolean, value: TemplateValue, contextItem: ContextItem): void;
