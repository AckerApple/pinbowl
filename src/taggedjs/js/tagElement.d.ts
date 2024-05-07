import { TagSupport } from './TagSupport.class';
import { TemplaterResult } from './TemplaterResult.class';
import { TagComponent } from './tag';
export declare function tagElement(app: TagComponent, // (...args: unknown[]) => TemplaterResult,
element: HTMLElement | Element, props?: unknown): {
    tagSupport: TagSupport;
    tags: TagComponent[];
};
export declare function runWrapper(templater: TemplaterResult): TagSupport;
