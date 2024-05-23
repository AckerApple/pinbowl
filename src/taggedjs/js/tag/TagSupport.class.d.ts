import { Props } from '../Props';
import { Context, ElementBuildOptions, TagMemory, TagTemplate } from './Tag.class';
import { TagGlobal, TemplaterResult } from '../TemplaterResult.class';
import { TagSubject } from '../subject.types';
import { DestroyOptions } from './destroy.support';
import { InsertBefore } from '../interpolations/Clones.type';
/** used only for apps, otherwise use TagSupport */
export declare class BaseTagSupport {
    templater: TemplaterResult;
    subject: TagSubject;
    isApp: boolean;
    appElement?: Element;
    strings?: string[];
    values?: any[];
    propsConfig: {
        latest: Props;
        latestCloned: Props;
        lastClonedKidValues: unknown[][];
    };
    memory: TagMemory;
    clones: (Element | Text | ChildNode)[];
    global: TagGlobal;
    hasLiveElements: boolean;
    constructor(templater: TemplaterResult, subject: TagSubject);
    /** Function that kicks off actually putting tags down as HTML elements */
    buildBeforeElement(insertBefore: InsertBefore, options?: ElementBuildOptions): void;
    getTemplate(): TagTemplate;
    update(): Context;
    updateContext(context: Context): Context;
}
export declare class TagSupport extends BaseTagSupport {
    templater: TemplaterResult;
    ownerTagSupport: TagSupport;
    subject: TagSubject;
    version: number;
    isApp: boolean;
    childTags: TagSupport[];
    constructor(templater: TemplaterResult, // at runtime rendering of a tag, it needs to be married to a new TagSupport()
    ownerTagSupport: TagSupport, subject: TagSubject, version?: number);
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
    updateBy(tagSupport: TagSupport): void;
    updateConfig(strings: string[], values: any[]): void;
    updateValues(values: any[]): Context;
    /** Used during HMR only where static content itself could have been edited */
    rebuild(): Promise<TagSupport>;
    getAppTagSupport(): TagSupport;
}
