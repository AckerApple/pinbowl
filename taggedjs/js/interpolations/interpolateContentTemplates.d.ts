import { Support } from '../tag/Support.class.js';
import { Context } from '../tag/Tag.class.js';
import { InterpolateOptions } from './interpolateElement.js';
import { InterpolateComponentResult } from './interpolateTemplate.js';
export declare function interpolateContentTemplates(context: Context, support: Support, options: InterpolateOptions, children: HTMLCollection): InterpolateComponentResult[];
