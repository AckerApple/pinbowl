import { Props } from './Props';
import { TagSupport } from './TagSupport.class';
import { TemplaterResult } from './TemplaterResult.class';
export declare function alterProps(props: Props, templater: TemplaterResult, ownerSupport: TagSupport): any;
export declare function callbackPropOwner(toCall: (...args: any[]) => any, callWith: any, templater: TemplaterResult, // only used to prevent rendering double
ownerSupport: TagSupport): any;
