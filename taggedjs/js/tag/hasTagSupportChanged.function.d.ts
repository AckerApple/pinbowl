import { BaseTagSupport } from './TagSupport.class.js';
import { TemplaterResult } from './TemplaterResult.class.js';
export declare function hasTagSupportChanged(lastSupport: BaseTagSupport, newTagSupport: BaseTagSupport, newTemplater: TemplaterResult): number | false;
export declare function hasKidsChanged(oldTagSupport: BaseTagSupport, newTagSupport: BaseTagSupport): number | false;
