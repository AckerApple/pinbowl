import { InsertBefore } from './InsertBefore.type.js';
import { Context, ElementBuildOptions } from '../tag/Tag.class.js';
import { TagSupport } from '../tag/TagSupport.class.js';
export declare function afterInterpolateElement(container: DocumentFragment, insertBefore: InsertBefore, tagSupport: TagSupport, context: Context, options: ElementBuildOptions): ChildNode[];
