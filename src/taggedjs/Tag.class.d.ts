import { TagSupport } from "./getTagSupport.js";
import { Provider } from "./providers.js";
import { Subscription } from "./Subject.js";
import { Counts } from "./interpolateTemplate.js";
import { State } from "./state.js";
export declare const variablePrefix = "__tagVar";
export declare const escapeVariable: string;
export declare const escapeSearch: RegExp;
export type Context = {
    [index: string]: any;
};
export type TagMemory = Record<string, any> & {
    context: Context;
    state: State;
};
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
    arrayValue?: any[];
    constructor(strings: string[], values: any[]);
    providers: Provider[];
    beforeRedraw(): void;
    afterRender(): void;
    afterClone(newTag: Tag): void;
    /** Used for array, such as array.map(), calls aka array.map(x => html``.key(x)) */
    key(arrayValue: any[]): this;
    destroy(options?: DestroyOptions): Promise<number>;
    destroySubscriptions(): void;
    destroyClones({ stagger }?: DestroyOptions): Promise<number>;
    updateByTag(tag: Tag): void;
    lastTemplateString: string | undefined;
    /** A method of passing down the same render method */
    setSupport(tagSupport: TagSupport): void;
    updateConfig(strings: string[], values: any[]): void;
    getTemplate(): {
        string: string;
        strings: string[];
        values: any[];
        context: Context;
    };
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
    depth: number;
};
export {};
