import { Props } from "./Props.js";
import { Tag, TagMemory } from "./Tag.class.js";
import { TagChildren } from "./tag.js";
import { TemplaterResult } from "./templater.utils.js";
export declare class TagSupport {
    templater: TemplaterResult;
    children: TagChildren;
    props?: unknown;
    latestProps: Props;
    latestClonedProps: Props;
    lastClonedKidValues: unknown[][];
    clonedProps: Props;
    memory: TagMemory;
    constructor(templater: TemplaterResult, children: TagChildren, // children tags passed in as arguments
    props?: unknown);
    oldest?: Tag;
    newest?: Tag;
    mutatingRender(): Tag;
    render(): Tag;
    /** Returns true when rendering owner is not needed. Returns false when rendering owner should occur */
    renderExistingTag(tag: Tag, newTemplater: TemplaterResult): boolean;
}
export declare function hasTagSupportChanged(oldTagSupport: TagSupport, newTagSupport: TagSupport): boolean;
export declare function hasPropChanges(props: Props, // natural props
pastCloneProps: Props, // previously cloned props
compareToProps: Props): boolean;
export declare function hasKidsChanged(oldTagSupport: TagSupport, newTagSupport: TagSupport): boolean;
