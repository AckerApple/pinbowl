import { TagSupport } from './TagSupport.class';
import { Counts } from './interpolateTemplate';
import { State } from './set.function';
import { InterpolatedTemplates } from './interpolations';
import { InterpolateSubject } from './processSubjectValue.function';
import { InsertBefore } from './Clones.type';
export declare const variablePrefix = "__tagvar";
export declare const escapeVariable: string;
export declare const escapeSearch: RegExp;
export type Context = {
    [index: string]: InterpolateSubject;
};
export type TagMemory = {
    state: State;
};
export interface TagTemplate {
    interpolation: InterpolatedTemplates;
    string: string;
    strings: string[];
    values: unknown[];
    context: Context;
}
export declare class Tag {
    strings: string[];
    values: any[];
    version: number;
    isTag: boolean;
    hasLiveElements: boolean;
    clones: (Element | Text | ChildNode)[];
    childTags: Tag[];
    tagSupport: TagSupport;
    lastTemplateString: string | undefined;
    ownerTag?: Tag;
    appElement?: Element;
    memory: {
        arrayValue?: unknown;
    };
    constructor(strings: string[], values: any[]);
    /** Used for array, such as array.map(), calls aka array.map(x => html``.key(x)) */
    key(arrayValue: unknown): this;
    destroy(options?: DestroyOptions): Promise<number>;
    destroySubscriptions(): void;
    destroyClones({ stagger }?: DestroyOptions): {
        promise: Promise<(void | undefined)[]>;
        stagger: number;
    } | {
        stagger: number;
        promise?: undefined;
    };
    /** Reviews elements for the presences of ondestroy */
    checkCloneRemoval(clone: Element | Text | ChildNode, stagger: number): Promise<void> | undefined;
    getTemplate(): TagTemplate;
    isLikeTag(tag: Tag): Boolean;
    updateByTag(tag: Tag): void;
    updateConfig(strings: string[], values: any[]): void;
    update(): Context;
    updateValues(values: any[]): Context;
    updateContext(context: Context): Context;
    getAppElement(): Tag;
    /** Used during HMR only where static content itself could have been edited */
    rebuild(): void;
    buildBeforeElement(insertBefore: InsertBefore, options?: ElementBuildOptions): void;
}
type DestroyOptions = {
    stagger: number;
    byParent?: boolean;
};
export type ElementBuildOptions = {
    counts: Counts;
    forceElement?: boolean;
};
export {};
