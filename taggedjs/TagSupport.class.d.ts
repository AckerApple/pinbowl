import { Props } from "./Props.js";
import { Tag, TagMemory } from "./Tag.class.js";
import { TagChildren } from "./tag.js";
import { TemplaterResult } from "./templater.utils.js";
export declare class TagSupport {
    templater: TemplaterResult;
    children: TagChildren;
    propsConfig: {
        latest: Props;
        latestCloned: Props;
        lastClonedKidValues: unknown[][];
        clonedProps: Props;
    };
    memory: TagMemory;
    constructor(templater: TemplaterResult, children: TagChildren, // children tags passed in as arguments
    props?: Props);
    oldest?: Tag;
    newest?: Tag;
    mutatingRender(): Tag;
    render(): Tag;
}
