import { BaseTagSupport } from "./TagSupport.class";
import { TemplaterResult } from "../TemplaterResult.class";
export declare function hasTagSupportChanged(oldTagSupport: BaseTagSupport, newTagSupport: BaseTagSupport, newTemplater: TemplaterResult): number | false;
export declare function hasKidsChanged(oldTagSupport: BaseTagSupport, newTagSupport: BaseTagSupport): number | false;
