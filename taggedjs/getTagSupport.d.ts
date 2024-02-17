import { Props } from "./Props.js";
import { Tag, TagMemory } from "./Tag.class.js";
import { TemplaterResult } from "./templater.utils.js";
export declare class TagSupport {
    templater: TemplaterResult;
    props?: unknown;
    latestProps: Props;
    clonedProps: Props;
    latestClonedProps: Props;
    memory: TagMemory;
    constructor(templater: TemplaterResult, props?: unknown);
    oldest?: Tag;
    newest?: Tag;
    hasPropChanges(props: any, // natural props
    pastCloneProps: any, // previously cloned props
    compareToProps: any): boolean;
    mutatingRender(): Tag;
    render(): Tag;
    renderExistingTag(tag: Tag, newTemplater: TemplaterResult): boolean;
}
export declare function getTagSupport(templater: TemplaterResult, props?: Props): TagSupport;
