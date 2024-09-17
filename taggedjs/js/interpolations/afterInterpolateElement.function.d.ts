import { Template } from './interpolateTemplate.js';
import { Context, ElementBuildOptions } from '../tag/Tag.class.js';
import { Support } from '../tag/Support.class.js';
export declare function afterInterpolateElement(container: DocumentFragment, template: Template, support: Support, context: Context, options: ElementBuildOptions): ChildNode[];
