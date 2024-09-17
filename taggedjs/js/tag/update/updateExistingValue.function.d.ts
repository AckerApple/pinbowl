import { BaseSupport, Support, SupportContextItem } from '../Support.class.js';
import { TemplateValue } from './processFirstSubject.utils.js';
import { ContextItem } from '../Context.types.js';
export declare function updateExistingValue(contextItem: ContextItem | SupportContextItem, value: TemplateValue, ownerSupport: BaseSupport | Support): void;
