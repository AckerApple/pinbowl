import { Props } from '../Props.js';
import { BaseSupport } from './Support.class.js';
import { TemplaterResult } from './TemplaterResult.class.js';
export declare function hasSupportChanged(lastSupport: BaseSupport, newTemplater: TemplaterResult): number | string | false;
export declare function immutablePropMatch(props: Props, pastCloneProps: Props): false | 2;
export declare function shallowPropMatch(props: Props, pastCloneProps: Props): false | 3 | 3.1 | 3.3;
export declare const shallowCompareDepth = 3;
export declare const deepCompareDepth = 10;
