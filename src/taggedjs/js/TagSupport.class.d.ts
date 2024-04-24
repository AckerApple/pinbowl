import { Props } from './Props';
import { Context, ElementBuildOptions, TagMemory, TagTemplate } from './Tag.class';
import { TagGlobal, TemplaterResult } from './TemplaterResult.class';
import { TagSubject } from './subject.types';
import { DestroyOptions } from './destroy.support';
import { InsertBefore } from './Clones.type';
/** used only for apps, otherwise use TagSupport */
export declare class BaseTagSupport {
    templater: TemplaterResult;
    subject: TagSubject;
    isApp: boolean;
    appElement?: Element;
    propsConfig: {
        latest: Props;
        latestCloned: Props;
        lastClonedKidValues: unknown[][];
    };
    memory: TagMemory;
    global: TagGlobal;
    constructor(templater: TemplaterResult, subject: TagSubject);
}
export declare class TagSupport extends BaseTagSupport {
    templater: TemplaterResult;
    ownerTagSupport: TagSupport;
    subject: TagSubject;
    version: number;
    isApp: boolean;
    hasLiveElements: boolean;
    childTags: TagSupport[];
    clones: (Element | Text | ChildNode)[];
    strings?: string[];
    values?: any[];
    lastTemplateString: string | undefined;
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
    update(): Context;
    updateBy(tagSupport: TagSupport): void;
    updateConfig(strings: string[], values: any[]): void;
    updateValues(values: any[]): Context;
    updateContext(context: Context): Context;
    /** Function that kicks off actually putting tags down as HTML elements */
    buildBeforeElement(insertBefore: InsertBefore, options?: ElementBuildOptions): void;
    getTemplate(): TagTemplate;
    /** Used during HMR only where static content itself could have been edited */
    rebuild(): void;
    getAppElement(): TagSupport;
}
