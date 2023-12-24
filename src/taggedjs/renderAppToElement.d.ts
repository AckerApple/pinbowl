import { TagSupport } from "./getTagSupport.js";
import { Tag } from "./Tag.class.js";
import { TemplaterResult } from "./tag.js";
export declare function renderAppToElement(app: (...args: unknown[]) => TemplaterResult, element: Element, props: unknown): void;
export declare function applyTagUpdater(wrapper: TemplaterResult): {
    tag: Tag;
    tagSupport: TagSupport;
};
