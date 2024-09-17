import { TemplateValue } from './processFirstSubject.utils.js';
import { ValueSubject } from '../../subject/ValueSubject.js';
import { AnySupport } from '../Support.class.js';
import { ContextItem } from '../Context.types.js';
export declare function processNewArrayValue(value: TemplateValue | ValueSubject<unknown>, ownerSupport: AnySupport, contextItem: ContextItem): ContextItem;
