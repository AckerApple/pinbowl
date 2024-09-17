import { DomObjectChildren } from "./ObjectNode.types.js";
import { BaseSupport, Support } from "../../tag/Support.class.js";
import { SubToTemplateOptions } from "../subscribeToTemplate.function.js";
import { Context } from "../../tag/Context.types.js";
import { ObjectChildren } from "./LikeObjectElement.type.js";
import { Counts } from "../interpolateTemplate.js";
export declare function attachDomElements(nodes: ObjectChildren, values: any[], support: BaseSupport | Support, counts: Counts, // used for animation stagger computing
context: Context, depth: number, // used to know if dynamic variables live within parent owner tag/support
owner?: Element, insertBefore?: Text, subs?: SubToTemplateOptions[]): {
    context: Context;
    subs: SubToTemplateOptions[];
    dom: DomObjectChildren;
};
