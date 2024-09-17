/** File largely responsible for reacting to element events, such as onclick */
import { AnySupport, BaseSupport, Support } from '../../tag/Support.class.js';
import { TagGlobal } from '../../tag/TemplaterResult.class.js';
export type Callback = (...args: any[]) => any;
export declare function bindSubjectCallback(value: Callback, support: AnySupport): {
    (element: Element, args: any[]): any;
    tagFunction: Callback;
    support: AnySupport;
};
export declare function runTagCallback(value: Callback, support: BaseSupport | Support, bindTo: unknown, args: any[]): any;
export declare function afterTagCallback(callbackResult: any, eventHandlerSupport: AnySupport): any;
export declare function checkAfterCallbackPromise(callbackResult: any, last: BaseSupport | Support, global: TagGlobal): any;
export declare function runBlocked(tag: BaseSupport | Support): BaseSupport | Support;
