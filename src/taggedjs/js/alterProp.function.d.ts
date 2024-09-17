import { AnySupport, BaseSupport, Support } from './tag/Support.class.js';
import { TemplaterResult } from './tag/TemplaterResult.class.js';
import { Props } from './Props.js';
import { UnknownFunction } from './tag/index.js';
import { Subject } from './subject/Subject.class.js';
export declare function castProps(props: Props, newSupport: BaseSupport | Support, depth: number): unknown[];
export declare function alterProp(prop: unknown, ownerSupport: BaseSupport | Support, newSupport: BaseSupport | Support, depth: number): unknown;
export declare function checkProp(value: unknown | TemplaterResult | SubableProp | unknown[] | Record<string, unknown>, ownerSupport: BaseSupport | Support, newSupport: BaseSupport | Support, depth: number): unknown;
type SubableProp = {
    [name: string]: {
        subscription: Subject<void>;
    };
};
export type WrapRunner = (() => unknown) & {
    original: unknown;
    mem: UnknownFunction;
    toCall: UnknownFunction;
};
export declare function getPropWrap(value: {
    mem?: unknown;
}, ownerSupport: BaseSupport | Support): {
    mem?: unknown;
};
/** Function shared by alterProps() and updateExistingTagComponent... TODO: May want to have to functions to reduce cycle checking?  */
export declare function callbackPropOwner(toCall: UnknownFunction, callWith: unknown[], ownerSupport: BaseSupport | Support): unknown;
export declare function isSkipPropValue(value: unknown): true | import("./tag/ValueTypes.enum.js").ValueType | undefined;
export declare function safeRenderSupport(newest: AnySupport, ownerSupport: AnySupport): AnySupport | undefined;
export {};
