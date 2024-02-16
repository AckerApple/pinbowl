import { TagSupport } from "./getTagSupport.js";
import { TagComponent, TemplaterResult } from "./templater.utils.js";
import { Tag } from "./Tag.class.js";
export declare function renderAppToElement(app: TagComponent, // (...args: unknown[]) => TemplaterResult,
element: Element, props: unknown): {
    tag: Tag;
    tags: TagComponent[];
};
export declare function applyTagUpdater(wrapper: TemplaterResult): {
    tag: Tag;
    tagSupport: TagSupport;
};
/** Overwrites arguments.tagSupport.mutatingRender */
export declare function addAppTagRender(tagSupport: TagSupport, tag: Tag): void;
