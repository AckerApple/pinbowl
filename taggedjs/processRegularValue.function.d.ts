import { DisplaySubject } from "./Tag.utils";
import { Template } from "./interpolateTemplate.js";
export type RegularValue = string | number | undefined | boolean;
export declare function processRegularValue(value: RegularValue, result: DisplaySubject, // could be tag via result.tag
template: Template): never[];
