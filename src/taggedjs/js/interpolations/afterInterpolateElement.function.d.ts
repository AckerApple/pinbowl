import { InsertBefore } from './Clones.type';
import { Context, ElementBuildOptions } from '../tag/Tag.class';
import { TagSupport } from '../tag/TagSupport.class';
export declare function afterInterpolateElement(container: Element, insertBefore: InsertBefore, tagSupport: TagSupport, context: Context, options: ElementBuildOptions): ChildNode[];
