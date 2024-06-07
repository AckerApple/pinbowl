import { BaseTagSupport, TagSupport } from './tag/TagSupport.class.js';
import { State } from './state/index.js';
import { Props } from './Props.js';
export declare function castProps(props: Props, newTagSupport: BaseTagSupport | TagSupport, stateArray: State): any[];
export declare function alterProp(prop: unknown, ownerSupport: BaseTagSupport | TagSupport, stateArray: State, newTagSupport: BaseTagSupport | TagSupport): any;
export declare function checkProp(value: any, ownerSupport: BaseTagSupport | TagSupport, stateArray: State, newTagSupport: BaseTagSupport | TagSupport, index?: string | number, newProp?: any, seen?: any[]): any;
export declare function getPropWrap(value: any, ownerSupport: BaseTagSupport | TagSupport, stateArray: State, newTagSupport: BaseTagSupport | TagSupport, name?: string | number, newProp?: any): any;
/** Function shared by alterProps() and updateExistingTagComponent... TODO: May want to have to functions to reduce cycle checking?  */
export declare function callbackPropOwner(toCall: Function, callWith: any, ownerSupport: BaseTagSupport | TagSupport, // <-- WHEN called from alterProp its owner OTHERWISE its previous
oldState: State): any;
