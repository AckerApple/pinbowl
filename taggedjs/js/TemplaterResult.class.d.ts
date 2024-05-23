import { Context, Tag } from './tag/Tag.class';
import { BaseTagSupport, TagSupport } from './tag/TagSupport.class';
import { Props } from './Props';
import { TagChildren, TagWrapper } from './tag/tag';
import { Provider } from './state/providers';
import { OnDestroyCallback } from './state/onDestroy';
import { TagSubject } from './subject.types';
import { OnInitCallback } from './state/onInit';
import { Subscription } from './subject/subject.utils';
import { InsertBefore } from './interpolations/Clones.type';
import { TagValues } from './tag/html';
export type OriginalFunction = (() => Tag) & {
    compareTo: string;
};
export type Wrapper = ((tagSupport: BaseTagSupport, subject: TagSubject) => TagSupport) & {
    parentWrap: TagWrapper<any>;
};
export type TagGlobal = {
    oldest?: TagSupport;
    newest?: TagSupport;
    context: Context;
    providers: Provider[];
    /** Indicator of re-rending. Saves from double rending something already rendered */
    renderCount: number;
    deleted: boolean;
    isApp?: boolean;
    insertBefore?: InsertBefore;
    placeholder?: Text;
    subscriptions: Subscription<any>[];
    destroyCallback?: OnDestroyCallback;
    init?: OnInitCallback;
};
export declare class TemplaterResult {
    props: Props;
    isTemplater: boolean;
    tagged: boolean;
    wrapper?: Wrapper;
    madeChildIntoSubject: boolean;
    tag?: Tag;
    children: TagChildren;
    constructor(props: Props);
    html(strings: string[] | TemplateStringsArray, ...values: TagValues): this;
}
