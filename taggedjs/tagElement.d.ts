import { TagSupport } from "./TagSupport.class.js";
import { TemplaterResult } from "./templater.utils.js";
import { Tag } from "./Tag.class.js";
import { TagComponent } from "./tag.js";
export declare function tagElement(app: TagComponent, // (...args: unknown[]) => TemplaterResult,
element: HTMLElement | Element, props: unknown): {
    tag: Tag;
    tags: TagComponent[];
};
export declare function applyTagUpdater(wrapper: TemplaterResult): {
    tag: Tag;
    tagSupport: TagSupport;
};
/** Overwrites arguments.tagSupport.mutatingRender */
export declare function addAppTagRender(tagSupport: TagSupport, tag: Tag): void;
