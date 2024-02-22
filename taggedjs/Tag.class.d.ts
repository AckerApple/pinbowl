import { TagSupport } from "./TagSupport.class.js";
import { Provider } from "./providers.js";
import { Subscription } from "./Subject.js";
import { Counts } from "./interpolateTemplate.js";
import { State } from "./state.js";
import { InterpolatedTemplates } from "./interpolations.js";
export declare const variablePrefix = "__tagvar";
export declare const escapeVariable: string;
export declare const escapeSearch: RegExp;
export type Context = {
    [index: string]: any;
};
export type TagMemory = Record<string, any> & {
    context: Context;
    state: State;
    providers: Provider[];
};
export interface TagTemplate {
    interpolation: InterpolatedTemplates;
    string: string;
    strings: string[];
    values: unknown[];
    context: Context;
}
export declare class ArrayValueNeverSet {
    isArrayValueNeverSet: boolean;
}
export declare class Tag {
    strings: string[];
    values: any[];
    isTag: boolean;
    clones: (Element | Text | ChildNode)[];
    cloneSubs: Subscription[];
    children: Tag[];
    tagSupport: TagSupport;
    ownerTag?: Tag;
    insertBefore?: Element;
    appElement?: Element;
    arrayValue: unknown | ArrayValueNeverSet;
    constructor(strings: string[], values: any[]);
    /** Used for array, such as array.map(), calls aka array.map(x => html``.key(x)) */
    key(arrayValue: unknown): this;
    destroy(options?: DestroyOptions): Promise<number>;
    destroySubscriptions(): void;
    destroyClones({ stagger }?: DestroyOptions): Promise<number>;
    updateByTag(tag: Tag): void;
    lastTemplateString: string | undefined;
    /** A method of passing down the same render method */
    setSupport(tagSupport: TagSupport): void;
    updateConfig(strings: string[], values: any[]): void;
    getTemplate(): TagTemplate;
    isLikeTag(tag: Tag): boolean;
    update(): Context;
    updateValues(values: any[]): Context;
    updateContext(context: Context): Context;
    getAppElement(): Tag;
    /** Used during HMR only where static content itself could have been edited */
    rebuild(): void;
    buildBeforeElement(insertBefore: Element, options?: ElementBuildOptions): (ChildNode | Element)[];
}
type DestroyOptions = {
    stagger: number;
    byParent?: boolean;
};
export type ElementBuildOptions = {
    counts: Counts;
    forceElement?: boolean;
};
export declare function processNewValue(hasValue: boolean, value: any, context: Context, variableName: string, tag: Tag): void;
export {};
