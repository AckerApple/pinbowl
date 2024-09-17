import { TemplaterResult } from './TemplaterResult.class.js';
import { TagWrapper } from './tag.utils.js';
import { AnySupport } from './Support.class.js';
import { Props } from '../Props.js';
export declare function executeWrap(templater: TemplaterResult, result: TagWrapper<unknown>, useSupport: AnySupport, castedProps?: Props): AnySupport;
