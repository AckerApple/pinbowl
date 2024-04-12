import { BaseTagSupport } from './TagSupport.class';
import { TemplaterResult } from './TemplaterResult.class';
import { Tag } from './Tag.class';
import { TagComponent } from './tag';
export declare function tagElement(app: TagComponent, // (...args: unknown[]) => TemplaterResult,
element: HTMLElement | Element, props: unknown): {
    tag: Tag;
    tags: TagComponent[];
};
export declare function applyTagUpdater(wrapper: TemplaterResult): {
    tag: Tag;
    tagSupport: BaseTagSupport;
};
